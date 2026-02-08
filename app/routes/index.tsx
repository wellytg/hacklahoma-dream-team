import { createFileRoute } from '@tanstack/react-router'
import { IntakeProvider } from '~/context/IntakeContext'
import { IntakeFlow } from '~/components/IntakeFlow'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <IntakeProvider>
      <IntakeFlow />
    </IntakeProvider>
  )
}
