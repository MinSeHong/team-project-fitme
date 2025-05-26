import RatingStars from './RatingStars';
import { useEffect } from 'react';
import './RecipeBoard.css';


function RecipeBoard(props) {
    // console.log('props',props)

    useEffect(()=>{
        const stars = document.querySelectorAll('.stars i');

        stars.forEach((star, index1) => {
        star.addEventListener('click', () => {
            stars.forEach((star, index2) => {
            index1 >= index2
                ? star.classList.add('active')
                : star.classList.remove('active');
                });
            });
        });
    })

  return (
    <div className="col-lg-4 col-md-6 col-sm-12 grid-item physics cemes">
        <a href={props.data.link}>
            <div className="project-single-box">
                <div className="project-thumb">
                    <img src={props.data.img}/>
                    {/* <div className='project-description'>
                        <div className='project-description-div'><i className='fa fa-commenting-o'></i><span>65,343</span></div>
                        <div className='project-description-div'><i className='fa fa-eye'></i><span>2,343</span></div>
                    </div> */}
                </div>
                <div className="project-content">
                    <div className="project-title" style={{height:"85%", left:"0", right:"0", margin:"auto"}}>
                        <img className='project-writer-image' src={props.data.userImg}/>

                        <h3 style={{display:"block", width:"90%", margin:"auto", marginBottom:"10px"}}><a href="blog-details.html">{props.data.title}</a></h3>
                        <span>{props.data.name}</span>
                    </div>
                </div>
            </div>
        </a>
    </div>
  );
}

export default RecipeBoard;

