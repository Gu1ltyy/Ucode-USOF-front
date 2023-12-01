import './footer.css';

function Footer({ className }) {
    return (
        <div className={`footer-global ${className}`}>
            <div className={'left-side-footer'}>
                <p className={'p-left-footer'}>Copyright: © 2023 | <a className="a-left-footer" href="https://t.me/gu1Ityy" 
                    target="_blank" rel="noopener noreferrer">akamyshenk (Gu1lty)</a> | All Rights Reserved</p>
            </div>
            <div className={'right-side-footer'}>
                <a href="#">Terms of Service</a> | <a href="#">Privacy Policy</a>
            </div>
        </div>
    );
}

export default Footer;