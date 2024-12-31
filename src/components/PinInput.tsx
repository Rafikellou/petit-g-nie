import { useState, useRef, useEffect } from 'react'

interface PinInputProps {
  onComplete: (pin: string) => void
  error?: boolean
}

export default function PinInput({ onComplete, error }: PinInputProps) {
  const [pin, setPin] = useState(['', '', '', ''])
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return // Prevent pasting multiple numbers

    const newPin = [...pin]
    newPin[index] = value

    setPin(newPin)

    // Move to next input if value is entered
    if (value !== '' && index < 3) {
      inputs.current[index + 1]?.focus()
    }

    // Check if PIN is complete
    if (newPin.every(digit => digit !== '')) {
      onComplete(newPin.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace
    if (e.key === 'Backspace' && index > 0 && pin[index] === '') {
      inputs.current[index - 1]?.focus()
    }
  }

  // Reset focus to first empty input when error occurs
  useEffect(() => {
    if (error) {
      setPin(['', '', '', ''])
      const firstEmptyIndex = pin.findIndex(digit => digit === '')
      inputs.current[firstEmptyIndex === -1 ? 0 : firstEmptyIndex]?.focus()
    }
  }, [error])

  return (
    <div className="flex justify-center gap-4">
      {pin.map((digit, index) => (
        <input
          key={index}
          ref={(el: HTMLInputElement | null) => {
            if (el) inputs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          onChange={e => handleChange(index, e.target.value)}
          onKeyDown={e => handleKeyDown(index, e)}
          className={`w-12 h-12 text-center text-2xl font-bold border-2 rounded-lg 
            ${error 
              ? 'border-red-500 bg-red-50' 
              : 'border-gray-300 focus:border-purple-500 focus:ring-purple-500'
            }
          `}
        />
      ))}
    </div>
  )
}
