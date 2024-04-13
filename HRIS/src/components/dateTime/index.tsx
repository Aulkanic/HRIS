import { useState, useEffect } from 'react';
import moment from 'moment';

export default function useCurrentDateTime(){
    const [currentDateTime, setCurrentDateTime] = useState(moment().format('MMMM Do YYYY, h:mm:ss a'));

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDateTime(moment().format('MMMM Do YYYY, h:mm:ss a'));
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    return currentDateTime;
}
