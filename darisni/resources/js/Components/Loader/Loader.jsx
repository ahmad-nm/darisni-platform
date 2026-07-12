import style from './Loader.module.css';

export function Loader() {
    return (
        <div className={style.loader}>
            <svg
                className={style.atom}
                viewBox="0 0 180 180"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="3D Atom Loader"
            >
                <defs>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur"/>
                        <feMerge>
                            <feMergeNode in="blur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                    <filter id="glowNucleus" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur"/>
                        <feMerge>
                            <feMergeNode in="blur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>

                {/* Rings */}
                <ellipse className={style.orbit} cx="90" cy="90" rx="70" ry="30" transform="rotate(0 90 90)"/>
                <ellipse className={style.orbit} cx="90" cy="90" rx="70" ry="30" transform="rotate(60 90 90)"/>
                <ellipse className={style.orbit} cx="90" cy="90" rx="70" ry="30" transform="rotate(120 90 90)"/>

                {/* Electrons */}
                <g className={style.orbitA}>
                    <circle className={style.electron} cx="140" cy="90" r="6"/>
                </g>
                <g className={style.orbitB}>
                    <circle className={style.electron} cx="130" cy="60" r="6"/>
                </g>
                <g className={style.orbitC}>
                    <circle className={style.electron} cx="120" cy="120" r="6"/>
                </g>

                {/* Nucleus */}
                <circle className={style.nucleus} cx="90" cy="90" r="10"/>
            </svg>
        </div>
    );
}