import { createClient } from '@supabase/supabase-js'
import { commonEnglishWords } from '../src/data/english-words'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Charger les variables d'environnement
dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Les variables d\'environnement NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requises')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function migrateWords() {
  console.log('Début de la migration des mots anglais...')
  let successCount = 0
  let errorCount = 0

  try {
    // 1. Créer le bucket pour les images
    console.log('Création du bucket pour les images...')
    const { data: bucketData, error: bucketError } = await supabase
      .storage
      .createBucket('english-words-images', {
        public: true,
        fileSizeLimit: 1024 * 1024 * 2, // 2MB limit
      })

    if (bucketError && bucketError.message !== 'Bucket already exists') {
      console.error('Erreur lors de la création du bucket:', bucketError)
      return
    }
    console.log('✓ Bucket créé ou déjà existant')

    // 2. Configurer la politique d'accès public pour le bucket
    console.log('Configuration de la politique d\'accès public...')
    const { error: policyError } = await supabase
      .storage
      .from('english-words-images')
      .createSignedUrls(['test.txt'], 60) // Ceci va échouer mais nous permet de vérifier l'accès

    if (policyError && !policyError.message.includes('The resource was not found')) {
      console.error('Erreur lors de la vérification de l\'accès au bucket:', policyError)
      return
    }
    console.log('✓ Bucket accessible')

    // 3. Migrer chaque mot
    console.log('\nDébut de la migration des mots...')
    for (const word of commonEnglishWords) {
      console.log(`Migration du mot: ${word.word}`)

      try {
        // Upload de l'image
        const imagePath = path.join(process.cwd(), 'public', word.image)
        const imageFile = fs.readFileSync(imagePath)
        const imageName = path.basename(word.image)
        
        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('english-words-images')
          .upload(imageName, imageFile, {
            cacheControl: '3600',
            upsert: true
          })

        if (uploadError && uploadError.message !== 'The resource already exists') {
          console.error(`Erreur lors de l'upload de l'image pour ${word.word}:`, uploadError)
          errorCount++
          continue
        }

        // Récupérer l'URL publique de l'image
        const { data: { publicUrl } } = supabase
          .storage
          .from('english-words-images')
          .getPublicUrl(imageName)

        // Insérer les données du mot
        const { error: insertError } = await supabase
          .from('english_words')
          .insert({
            word: word.word,
            translation: word.translation,
            category: word.category,
            image_url: publicUrl,
            example: word.example,
            example_translation: word.exampleTranslation || '' // Utiliser une chaîne vide si pas de traduction
          })

        if (insertError) {
          console.error(`Erreur lors de l'insertion du mot ${word.word}:`, insertError)
          errorCount++
          continue
        }

        console.log(`✓ Mot "${word.word}" migré avec succès`)
        successCount++

      } catch (error) {
        console.error(`Erreur lors de la migration du mot ${word.word}:`, error)
        errorCount++
      }
    }

    console.log('\nMigration terminée !')
    console.log(`Succès: ${successCount} mots`)
    console.log(`Erreurs: ${errorCount} mots`)

  } catch (error) {
    console.error('Erreur lors de la migration:', error)
  }
}

// Exécuter la migration
migrateWords()
