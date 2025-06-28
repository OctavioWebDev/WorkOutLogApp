import React, { createContext, useContext, ReactNode } from 'react'

interface StripeContextType {
  // Add Stripe-related properties here later
}

const StripeContext = createContext<StripeContextType | undefined>(undefined)

export const useStripe = () => {
  const context = useContext(StripeContext)
  if (context === undefined) {
    throw new Error('useStripe must be used within a StripeProvider')
  }
  return context
}

interface StripeProviderProps {
  children: ReactNode
}

export const StripeProvider: React.FC<StripeProviderProps> = ({ children }) => {
  const value: StripeContextType = {}

  return <StripeContext.Provider value={value}>{children}</StripeContext.Provider>
}

export default StripeContext
