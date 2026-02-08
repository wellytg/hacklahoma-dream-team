import { motion } from 'framer-motion'

export function ActionCardSkeleton({ index = 0 }: { index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-5"
    >
      <div className="animate-pulse flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0 space-y-2">
          <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-2/5" />
          <div className="h-3 bg-stone-200 dark:bg-stone-700 rounded w-3/4" />
          <div className="flex items-center gap-3 mt-2">
            <div className="h-3 bg-stone-200 dark:bg-stone-700 rounded w-24" />
            <div className="h-3 bg-stone-200 dark:bg-stone-700 rounded w-16" />
          </div>
        </div>
        <div className="h-5 bg-stone-200 dark:bg-stone-700 rounded-full w-16" />
      </div>
    </motion.div>
  )
}
