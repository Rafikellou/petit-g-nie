import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Charger les variables d'environnement
dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Les variables d\'environnement Supabase ne sont pas définies')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

interface Question {
  class: string
  subject: string
  topic: string
  period: string
  specificity: string
  type: string
  question: string
  options: string[]
  correct_answer: string
}

function formatQuestion(question: any): Question {
  return {
    class: question.class,
    subject: question.subject,
    topic: question.topic,
    period: question.period,
    specificity: question.specificity,
    type: question.type,
    question: question.question,
    options: question.options,
    correct_answer: question.correctAnswer
  }
}

async function importQuestions() {
  try {
    // Lire le fichier JSON
    const jsonPath = path.join(process.cwd(), 'questions_ce1_complete.json')
    const questions = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
    .map(formatQuestion)

    console.log(`Importation de ${questions.length} questions...`)

    // Importer les questions par lots de 50
    const batchSize = 50
    for (let i = 0; i < questions.length; i += batchSize) {
      const batch = questions.slice(i, i + batchSize)
      
      const { data, error } = await supabase
        .from('questions')
        .insert(batch)
        .select()

      if (error) {
        console.error(`Erreur lors de l'importation du lot ${i / batchSize + 1}:`, error)
        continue
      }

      console.log(`Lot ${i / batchSize + 1} importé avec succès (${batch.length} questions)`)
    }

    console.log('Importation terminée !')
  } catch (error) {
    console.error('Erreur lors de l\'importation:', error)
    process.exit(1)
  }
}

importQuestions()
