import { useState, useEffect, useRef } from 'react';
import {
    Timeline,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineItem,
    TimelineSeparator,
} from '@mui/lab';
import { motion, useAnimationControls } from 'framer-motion';
import {
    Typography,
    Box,
    Paper
} from '@mui/material/';
import shuffleLetters from 'shuffle-letters';

//importación acciones
import useWindowHeight from './useWindowHeight';

function LineaTiempo(props) {
    const {
        text,
        titulo,
        transferTeclaPresionada,
        setTransferTeclaPresionada,
        cambios,
        duracion,
        isMobile
    } = props;
    const scrollContainerRef = useRef(null);
    const text2Ref = useRef(null);
    const windowHeight = useWindowHeight();
    const controls = useAnimationControls();
    const container = {
        show: {
            transition: {
                staggerChildren: 0.01,
            },
        },
    };
    const [itemsTimeline, setItemsTimeline] = useState(null);
    const [item2, setItem2] = useState(null);

    //useEffect

    useEffect(() => {
        if (!text) {
            setItemsTimeline(null);
        } else {            
            setTimeout(() => {
                setItemsTimeline(text);
            }, 350);            
        };
    }, [text]);

    useEffect(() => {
        if (!itemsTimeline) return;
        if (scrollContainerRef.current) {
            setItem2({
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { delay: 0.5 } },
                initial: {
                    y: 0,
                },
                hover: {
                    y: -1 * (scrollContainerRef.current.scrollHeight - (windowHeight - 175)),
                    transition: {
                        type: 'tween',
                        ease: 'linear',
                        duration: duracion,
                        delay: 1,
                        repeat: Infinity,
                        initialValue: { y: 0 },
                        repeatDelay: 1,
                    },
                },
            });
            setTimeout(() => {
                controls.start("hover");
            }, 10);
        };
    }, [itemsTimeline]);

    useEffect(() => {
        if (!transferTeclaPresionada) return;
        if (transferTeclaPresionada === "4") {
            controls.stop();
            controls.set("initial");
            shuffleLetters(document.querySelector('h2'), {
                iterations: 12,
                fps: 60,                
            });
            setTransferTeclaPresionada(null);
        };
        if (transferTeclaPresionada === "0") {
            setTransferTeclaPresionada(null);
        };
    }, [transferTeclaPresionada]);

    const generarStringAlfanumerico = () => {
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let resultado = '';
        for (let i = 0; i < 5; i++) {
            const indice = Math.floor(Math.random() * caracteres.length);
            resultado += caracteres.charAt(indice);
        }
        return resultado;
    };

    const TimelineComp = () => (
        <Timeline
            position="right"
            sx={{
                '& .MuiTimelineItem-root:before': {
                    display: 'none',
                },
            }}
        >
            {itemsTimeline.map((item, index) => {
                const last = itemsTimeline.length === index + 1;
                return (
                    <TimelineItem key={`nodo-${index}`}>
                        <TimelineSeparator>
                            <TimelineDot                              
                                className="bg-[#161616] w-32 h-32 p-0 mt-0 flex items-center justify-center"
                            >
                                {index + 1}
                            </TimelineDot>
                            {!last && <TimelineConnector />}
                        </TimelineSeparator>
                        <TimelineContent className="flex flex-col items-start pt-0 pb-48 text-[#F5F5F5]">
                            <Typography className="text-sm">item.descripción</Typography>
                            <Box
                                className="mt-16 py-16 pl-20 rounded-lg border border-[rgba(255,255,255,0.25)] w-full"
                                sx={{
                                    backgroundColor: "rgba(0, 0, 0, 0.2)"
                                }}
                            >
                                <div className="flex flex-col mt-8 md:mt-4 text-md leading-5">
                                    <Typography component="div" variant="body2" className="whitespace-pre-line text-16">
                                        {item}
                                    </Typography>
                                </div>
                            </Box>
                        </TimelineContent>
                    </TimelineItem>
                )
            })}
        </Timeline>
    );

    if (!itemsTimeline) {
        return null
    };

    return (
        itemsTimeline && (
            <motion.div
                className="w-full p-24 md:p-36"
                variants={container}
                initial="hidden"
                animate="show"
            >
                <div className="flex flex-col sm:flex-row mb-24">
                    <div>
                        <Typography variant="h2" ref={text2Ref} className="text-24 text-[#F5F5F5] uppercase font-bold">
                            {`Histórico concepto: [ ${titulo} - ${generarStringAlfanumerico()} ]`}
                        </Typography>
                        <Typography className="mt-2 text-12 text-[#F5F5F5] uppercase font-semibold tracking-widest">{`Secuencia de cambios en producto ${cambios.producto} - dinámico ${cambios.dinamico}`}</Typography>
                    </div>
                </div>
                {isMobile ? (
                    <div className="w-full relative h-full md:pr-16">
                        <TimelineComp />
                    </div>
                ) : (
                    <Paper elevation={3} className="overflow-hidden shadow-2xl bg-[transparent] border border-[rgba(255,255,255,0.1)] border-solid">
                        <motion.div
                            variants={item2}
                            className="w-full relative h-auto z-99 md:pr-16"
                            ref={scrollContainerRef}
                            style={{ height: windowHeight - 200 }}
                            initial="initial"
                            animate={controls}
                        >
                            <TimelineComp />
                        </motion.div>
                    </Paper>
                )}
            </motion.div >
        )
    );
}

export default LineaTiempo;