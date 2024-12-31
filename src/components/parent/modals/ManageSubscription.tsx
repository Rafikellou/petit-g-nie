import { Dialog } from '@headlessui/react'
import { X, Check, Sparkles } from 'lucide-react'

interface ManageSubscriptionProps {
  isOpen: boolean
  onClose: () => void
  currentPlan: string
  onUpgrade: () => void
  isUpgrading: boolean
}

export default function ManageSubscription({
  isOpen,
  onClose,
  currentPlan,
  onUpgrade,
  isUpgrading
}: ManageSubscriptionProps) {
  const plans = [
    {
      name: 'Gratuit',
      price: '0€',
      features: [
        'Accès à 1 profil enfant',
        'Exercices de base',
        'Suivi hebdomadaire'
      ],
      current: currentPlan === 'free'
    },
    {
      name: 'Premium',
      price: '9.99€',
      period: '/mois',
      features: [
        'Accès illimité aux profils',
        'Tous les exercices',
        'Suivi en temps réel',
        'Support prioritaire',
        'Exercices personnalisés'
      ],
      current: currentPlan === 'premium'
    }
  ]

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="relative overflow-hidden rounded-2xl bg-[var(--background-dark)] border border-[var(--card-border)] w-full max-w-2xl">
          {/* Header */}
          <div className="relative p-6 border-b border-[var(--card-border)]">
            <Dialog.Title className="text-2xl font-bold text-gradient">
              Gérer l'abonnement
            </Dialog.Title>
            <button
              onClick={onClose}
              className="absolute right-6 top-6 icon-container hover:text-[var(--primary)]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`glass-card p-6 ${plan.name === 'Premium' ? 'relative overflow-hidden' : ''}`}
                >
                  {plan.name === 'Premium' && (
                    <div className="absolute -top-0.5 -right-0.5">
                      <div className="relative">
                        <div className="absolute inset-0 animate-spin-slow bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--primary)]" />
                        <div className="relative bg-[var(--background-dark)] text-[var(--primary)] px-3 py-1 text-sm font-medium">
                          Recommandé
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      {plan.name === 'Premium' && (
                        <Sparkles className="w-5 h-5 text-[var(--primary)]" />
                      )}
                      <h3 className="text-xl font-semibold">{plan.name}</h3>
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-gradient">
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-white/60">{plan.period}</span>
                      )}
                    </div>

                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <div className="icon-container w-6 h-6 shrink-0">
                            <Check className="w-3 h-3 text-[var(--primary)]" />
                          </div>
                          <span className="text-white/80">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {plan.current ? (
                      <button
                        className="w-full btn-modern opacity-50 cursor-not-allowed"
                        disabled
                      >
                        <span className="relative z-10">Plan actuel</span>
                      </button>
                    ) : (
                      <button
                        onClick={onUpgrade}
                        disabled={isUpgrading}
                        className="w-full btn-modern"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          {isUpgrading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                              <span>Mise à niveau...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4" />
                              <span>Passer au Premium</span>
                            </>
                          )}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-[var(--card-border)] bg-[var(--background-light)]">
            <p className="text-sm text-white/60 text-center">
              Les paiements sont sécurisés et vous pouvez annuler à tout moment.
              <br />
              Pour toute question, contactez notre support à support@petit-genie.com
            </p>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
