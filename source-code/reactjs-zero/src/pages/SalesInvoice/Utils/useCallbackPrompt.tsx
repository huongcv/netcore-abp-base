/* eslint-disable react-hooks/exhaustive-deps */
import {useCallback, useEffect, useState} from 'react'
import {useLocation, useNavigate} from 'react-router'
import {useBlocker} from "react-router-dom";

export function useCallbackPrompt(when: boolean): (boolean | (() => void)) [] {
    const navigate = useNavigate()
    const location = useLocation()
    const [showPrompt, setShowPrompt] = useState(false)
    const [lastLocation, setLastLocation] = useState<any>(null)
    const [confirmedNavigation, setConfirmedNavigation] = useState(false)


    const cancelNavigation = useCallback(() => {
        setShowPrompt(false)
        setLastLocation(null)
    }, [])

    // handle blocking when user click on another route prompt will be shown
    const handleBlockedNavigation = useCallback(
        (nextLocation: any) => {
            const when = Number(sessionStorage.getItem('prompt_sell')) || 0;
            // console.log(when);
            if (!when) {
                return false;
            }
            // in if condition we are checking next location and current location are equals or not

            if (
                !confirmedNavigation &&
                nextLocation?.nextLocation?.pathname !== location?.pathname
            ) {
                setShowPrompt(true)
                setLastLocation(nextLocation)
                return true
            }
            return false
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [confirmedNavigation, location]
    )

    const confirmNavigation = useCallback(() => {
        setShowPrompt(false)
        setConfirmedNavigation(true)
    }, [])

    useEffect(() => {
        if (confirmedNavigation && lastLocation) {
            navigate(lastLocation?.nextLocation.pathname)

            // Clean-up state on confirmed navigation
            // setConfirmedNavigation(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [confirmedNavigation, lastLocation])

    useBlocker(handleBlockedNavigation)

    return [showPrompt, confirmNavigation, cancelNavigation]
}
