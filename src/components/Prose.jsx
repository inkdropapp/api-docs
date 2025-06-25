import clsx from 'clsx'

export function Prose({ as, className, ...props }) {
  let Component = as ?? 'div'

  return (
    <Component
      className={clsx(
        className,
        'prose dark:prose-invert',
        // `html :where(& > *)` is used to select all direct children without an increase in specificity like you'd get from just `& > *`
        '[html_:where(&>*)]:mx-auto [html_:where(&>*)]:max-w-2xl lg:[html_:where(&>*)]:mx-[calc(50%-min(50%,var(--container-lg)))] lg:[html_:where(&>*)]:max-w-3xl',
      )}
      {...props}
    />
  )
}
