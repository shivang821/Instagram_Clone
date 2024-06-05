import splashInstaIcon from './splashInstaIcon.png'
import instaMetaIcon from './instaMetaIcon.png'
import './splash.css'
const Splash = () => {
    const darkmode=localStorage.getItem('darkmode')
    return (
        <div className='splashScreenDiv' style={{backgroundColor:darkmode==='enable'?'#000000':'#ffffff'}} >
            <img src={splashInstaIcon} alt="" />
            <div className='outer' >
                <div className='inner'>
                    <h2>Instagram</h2>
                </div>
            </div>
            <div className='instaMetaImg'>
                <h3>from</h3>
                <img src={instaMetaIcon} alt="" />
            </div>
        </div>
    )
}

export default Splash