import { useEffect } from 'react';
import './RatingStars.css';

function RatingStars() {

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
    <div className="stars">
        <i className="fa-solid fa-star"></i>
        <i className="fa-solid fa-star"></i>
        <i className="fa-solid fa-star"></i>
        <i className="fa-solid fa-star"></i>
        <i className="fa-solid fa-star"></i>
    </div>
  );
}

export default RatingStars;

