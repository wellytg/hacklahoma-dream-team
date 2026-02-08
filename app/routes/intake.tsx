import { createFileRoute } from '@tanstack/react-router'
import { IntakeProvider } from '~/context/IntakeContext'
import { IntakeFlow } from '~/components/IntakeFlow'

export const Route = createFileRoute('/intake')({
  component: IntakePage,
})

function IntakePage() {
  return (
    <IntakeProvider>
      <IntakeFlow />
    </IntakeProvider>
  )
}
