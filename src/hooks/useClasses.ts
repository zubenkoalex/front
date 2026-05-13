export default function useClasses(initialValue: string, className: string) {

    const rootClasses = [initialValue]

    if (className) {
        rootClasses.push(className)
    }

    const classes = rootClasses.join(' ')

    return classes
}