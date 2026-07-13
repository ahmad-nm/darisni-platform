import { Navbar } from '../../../../Components/navBar/nav';
import { Intro } from '../Introduction/Introduction';
import SearchSection from './SearchSection';

import style from '../../Home.module.css';

export default function HomeHeader(props) {
  return (
    <header className={style.HomeHeader}>
      <Navbar />

      <Intro />

      <SearchSection {...props} />
    </header>
  );
}