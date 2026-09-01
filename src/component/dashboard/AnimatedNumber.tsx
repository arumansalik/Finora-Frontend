import {
    useEffect,
    useState,
} from "react"


interface AnimatedNumberProps {
    value: number
    prefix?: string
}


export default function AnimatedNumber({
                                           value,
                                           prefix = "",
                                       }: AnimatedNumberProps) {

    const [displayValue, setDisplayValue] =
        useState(0)


    useEffect(() => {

        const duration = 700

        const startTime =
            performance.now()


        const animate =
            (currentTime: number) => {

                const elapsed =
                    currentTime -
                    startTime


                const progress =
                    Math.min(
                        elapsed /
                        duration,
                        1
                    )


                const eased =
                    1 -
                    Math.pow(
                        1 - progress,
                        3
                    )


                setDisplayValue(
                    value * eased
                )


                if (
                    progress < 1
                ) {

                    requestAnimationFrame(
                        animate
                    )
                }
            }


        requestAnimationFrame(
            animate
        )

    }, [value])


    return (
        <>
            {prefix}
            {displayValue.toLocaleString(
                "en-IN",
                {
                    maximumFractionDigits: 0,
                }
            )}
        </>
    )
}