import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

function Banner() {
    return (
        <>
            <OwlCarousel items={1} autoplay autoplayTimeout={5000} autoplayHoverPause style={{width:'1240px',height:'280px',marginBottom:'30px'}}>
                <div>
                    <img src={require('./images/b1.jpg')} alt="메인베너1" />
                </div>
                <div>
                    <img src={require('./images/b2.jpg')} alt="메인베너2" />
                </div>
            </OwlCarousel>
        </>
    );
}

export default Banner;