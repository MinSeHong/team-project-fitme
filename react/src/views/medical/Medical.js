import { useEffect, useState} from 'react';
import Breadcumb from '../component/Breadcumb/Breadcumb';
import Header from '../component/header/Header';
import HeaderTop from '../component/headerTop/HeaderTop';
import Loader from '../component/loader/Loader';
import './Medical.css';
import $ from 'jquery';
import axios from 'axios';

import img_medical from '../../assets/images/breadcumb/medical.jpg'


function Medical() {

	const [age, setAge] = useState('');
	const [bloodPressure, setBloodPressure] = useState('');
	const [glucose, setGlucose] = useState('');
	const [cp, setCp] = useState('0');
	const [chol, setChol] = useState('');
	const [restecg, setRestecg] = useState('0');
	const [thalach, setThalach] = useState('');
	const [exang, setExang] = useState('0');
	const [oldpeak, setOldpeak] = useState('0');
	const [slope, setSlope] = useState('0');
	const [ca, setCa] = useState('0');
	const [thal, setThal] = useState('0');
	const [gender, setGender] = useState('M'); 
	const [height, setHeight] = useState('');
	const [weight, setWeight] = useState('');
	const [pregnancies, setPregnancies] = useState('0'); // 임신 횟수
    const [diabetesPedigreeFunction, setDiabetesPedigreeFunction] = useState(''); // 당뇨병 가족력
    const [skinThickness, setSkinThickness] = useState(''); // 피부 두께
    const [insulin, setInsulin] = useState(''); // 인슐린 수치

	
	

	const [prediction, setPrediction] = useState(null); // 고혈압 예측 결과 저장을 위한 상태
	const [predictionDiabe, setPredictionDiabe] = useState(null);

	const handleChange = (setter) => (e) => {
		setter(e.target.value);
	  };

	useEffect(()=>{
		$('.mm-prev-btn').hide();

	var x;
    var y;
    var i;
    var p;
	var count;
	var current;
	var percent;
	var z = [];


	init();
	getCurrentSlide();
	goToNext();
	goToPrev();
	getCount();
	buildStatus();
	deliverStatus();
	goBack();

	function init() {
		$('.mm-survey-container .mm-survey-page').each(function() {
			var item;
			var page;
			item = $(this);
			page = item.data('page');
			item.addClass('mm-page-'+page);
		});

	}

	function getCount() {
		count = $('.mm-survey-page').length;
		return count;
	}

	function goToNext() {
		$('.mm-next-btn').on('click', function() {
			goToSlide(x);
			getCount();
			current = x + 1;
			var g = current/count;
			buildProgress(g);
			var y = (count + 1);
			getButtons();
			$('.mm-survey-page').removeClass('active');
			$('.mm-page-'+current).addClass('active');
			getCurrentSlide();
			checkStatus();
			if( $('.mm-page-'+count).hasClass('active') ){
				if( $('.mm-page-'+count).hasClass('pass') ) {
					$('.mm-finish-btn').addClass('active');
				}
				else {
					$('.mm-page-'+count+' .mm-survery-content .mm-survey-item').on('click', function() {
						$('.mm-finish-btn').addClass('active');
					});
				}
			}
			else {
				$('.mm-finish-btn').removeClass('active');
				if( $('.mm-page-'+current).hasClass('pass') ) {
					$('.mm-survey-container').addClass('good');
					$('.mm-survey').addClass('okay');
				}
				else {
					$('.mm-survey-container').removeClass('good');
					$('.mm-survey').removeClass('okay');
				}
			}
			buttonConfig();
		});

	}

	function goToPrev() {
		$('.mm-prev-btn').on('click', function() {
			goToSlide(x);
			getCount();			
			current = (x - 1);
			var g = current/count;
			buildProgress(g);
			var y = count;
			getButtons();
			$('.mm-survey-page').removeClass('active');
			$('.mm-page-'+current).addClass('active');
			getCurrentSlide();
			checkStatus();
			$('.mm-finish-btn').removeClass('active');
			if( $('.mm-page-'+current).hasClass('pass') ) {
				$('.mm-survey-container').addClass('good');
				$('.mm-survey').addClass('okay');
			}
			else {
				$('.mm-survey-container').removeClass('good');
				$('.mm-survey').removeClass('okay');
			}
			buttonConfig();
		});

	}

	function buildProgress(g) {
		if(g > 1){
			g = g - 1;
		}
		else if (g === 0) {
			g = 1;
		}
		g = g * 100;
		$('.mm-survey-progress-bar').css({ 'width' : g+'%' });
	}

	function goToSlide(x) {
		return x;
	}

	function getCurrentSlide() {
		$('.mm-survey-page').each(function() {
			var item;
			item = $(this);

			if( $(item).hasClass('active') ) {
				x = item.data('page');
			}
			else {
			}
			return x;
		});
	}

	function getButtons() {

		if(current === 0) {
			current = y;
		}
		if(current === count) {
			$('.mm-next-btn').hide();
		}
		else if(current === 1) {
			$('.mm-prev-btn').hide();
		}
		else {
			$('.mm-next-btn').show();
			$('.mm-prev-btn').show();
		}

	}

	$('.mm-survey-q li input').each(function() {

		var item;
		item = $(this);

		$(item).on('click', function() {
			if( $('input:checked').length > 0 ) {
		    	$('label').parent().removeClass('active');
		    	item.closest( 'li' ).addClass('active');
			}
			else {
				//
			}
		});

	});

	percent = (x/count) * 100;
	$('.mm-survey-progress-bar').css({ 'width' : percent+'%' });

	function checkStatus() {
		$('.mm-survery-content .mm-survey-item').on('click', function() {
			var item;
			item = $(this);
			item.closest('.mm-survey-page').addClass('pass');
		});
	}

	function buildStatus() {
		$('.mm-survery-content .mm-survey-item').on('click', function() {
			var item;
			item = $(this);
			item.addClass('bingo');
			item.closest('.mm-survey-page').addClass('pass');
			$('.mm-survey-container').addClass('good');
		});
	}

	function deliverStatus() {
		$('.mm-survey-item').on('click', function() {
			if( $('.mm-survey-container').hasClass('good') ){
				$('.mm-survey').addClass('okay');
			}
			else {
				$('.mm-survey').removeClass('okay');	
			}
			buttonConfig();
		});
	}


	function buttonConfig() {
		if( $('.mm-survey').hasClass('okay') ) {
			$('.mm-next-btn button').prop('disabled', false);
		}
		else {
			$('.mm-next-btn button').prop('disabled', true);
		}
	}

	function goBack() {
		$('.mm-back-btn').on('click', function() {
			$('.mm-survey-bottom').slideDown();
			$('.mm-survey-results').slideUp();
		});
	}
	})

	

	{/*판단 결과 값 fetch로 받을 부분*/}
	const submitData = async (e) => {
		e.preventDefault();		
		$('.mm-finish-btn').on('click', function() {
			$('.mm-survey-bottom').slideUp();
			$('.mm-survey-results').slideDown();
		});

			const transformedInputs = {
				sex: gender === 'M' ? 0 : 1,
				fbs: glucose > 120 ? 1 : 0,
				cp: cp === '1' ? 0 : 1,
				restecg: restecg === '1' ? 0 : 1,
				exang: exang === '1' ? 0 : 1,
				oldpeak: oldpeak === '1' ? 1.0 : 3.0,
				slope: slope === '1' ? 0 : 2,
				ca: ca === '1' ? 0 : 2,
				thal: thal === '1' ? 1 : 3,
			  };
	
			// 로깅
			console.log("폼 제출 시 데이터:", {
				age,
				bloodPressure,
				glucose,
				cp,
				chol,
				restecg,
				thalach,
				exang,
				oldpeak,
				slope,
				ca,
				thal,
				gender,
				height,
				weight,
				transformedInputs // 성별로인한 변환된 입력값도 함께 로깅
			});
	
			try {
				$('.mm-survey-result-container').css("display","none");
				$('.survey-button-disabled').css("display","none");
				$(".book_loader").fadeIn();
				console.log('고혈압 데이터 전송');
				const response1 = await axios.get(
				`http://localhost:5000/hypertension?sex=${transformedInputs.sex}&age=${age}&fbs=${transformedInputs.fbs}&trestbps=${bloodPressure}` +
				`&cp=${transformedInputs.cp}&chol=${chol}&restecg=${transformedInputs.restecg}&thalach=${thalach}&exang=${transformedInputs.exang}&oldpeak=${transformedInputs.oldpeak}&slope=${transformedInputs.slope}&ca=${transformedInputs.ca}&thal=${transformedInputs.thal}`
				);
			   // 예측 결과 저장
			   setPrediction(response1.data.hypertension_proba);
			
			   console.log('당뇨병 데이터 전송');
			   const response2 = await axios.get(`http://localhost:5000/diabetes?age=${age}&pregnancies=${pregnancies}&glucose=${glucose}`
			   + `&bloodPressure=${bloodPressure}&skinThickness=${skinThickness}&insulin=${insulin}&diabetesPedigreeFunction=${diabetesPedigreeFunction}&height=${height}&weight=${weight}`);
			   setPredictionDiabe(response2.data.prediction); // API 응답에서 예측 결과 저장


			   $(".book_loader").fadeOut();
			   $('.survey-button-disabled').css("display","block");
			   $('.mm-survey-result-container').css("display","block");
			} catch (error) {
				console.error("Error fetching prediction data:", error);
				setPredictionDiabe(null); // 에러 발생 시 예측 결과 초기화
			}

	}


	const [viewDiabetes, setViewDiabetes] = useState(true);
	const [viewHighBloodPressure, setViewHighBloodPressure] = useState(false);

	{/* 당뇨병 확인 클릭 */}
	const Diabetes = () =>{
		setViewDiabetes(true);
		setViewHighBloodPressure(false);
	}
	
	{/* 고혈압 확인 클릭 */}
	const HighBloodPressure = () =>{
		setViewDiabetes(false);
		setViewHighBloodPressure(true);
	}


  return (
    <>
		{/*헤더 위*/}
		<HeaderTop/>
		{/*헤더 메인 메뉴*/}
		<Header/>
		{/* 제목 배경화면 */}
		<Breadcumb title="Medical" content="social"  img_title={img_medical}/>

		<div className="container">
			{/* 전체 값을 보내는 방식 form post 또는 get으로*/}
			<form onSubmit={submitData}>
				<div className="col-sm-12" >
					<div className="mm-survey">
						<div className="mm-survey-progress">
							<div className="mm-survey-progress-bar mm-progress"></div>
						</div>

						{/* 결과값 나오는 부분 */}
						<div className="mm-survey-results">
							<div className="mm-survey-results-container">
								
								
								<div className="book_loader">
									<div>
										<ul>
										<li>
											<svg fill="currentColor" viewBox="0 0 90 120">
											<path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z"></path>
											</svg>
										</li>
										<li>
											<svg fill="currentColor" viewBox="0 0 90 120">
											<path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z"></path>
											</svg>
										</li>
										<li>
											<svg fill="currentColor" viewBox="0 0 90 120">
											<path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z"></path>
											</svg>
										</li>
										<li>
											<svg fill="currentColor" viewBox="0 0 90 120">
											<path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z"></path>
											</svg>
										</li>
										<li>
											<svg fill="currentColor" viewBox="0 0 90 120">
											<path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z"></path>
											</svg>
										</li>
										<li>
											<svg fill="currentColor" viewBox="0 0 90 120">
											 <path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z"></path>
											</svg>
										</li>
										</ul>
									</div><span>Loading</span>
								</div>

								<div className='mm-survey-result-container'>
									{viewDiabetes &&(<div className='mm-survey-result-item'>
										당신의 당뇨병 질환의 예측 확률<br/><span className='result-percent-style'>{predictionDiabe}%</span> 입니다.
									</div>)}

									{viewHighBloodPressure &&(<div className='mm-survey-result-item'>
										당신의 고혈압 질환의 예측 확률<br/><span className='result-percent-style'>{prediction}%</span> 입니다.
									</div>)}
								</div>

								<div className="mm-survey-result-div">
									<button className='survey-button-disabled' onClick={Diabetes}>
										당뇨병
									</button>
									<button  className='survey-button-disabled' onClick={HighBloodPressure}>
										고혈압
									</button>
								</div>
							</div>
					
						</div>

						<div className="mm-survey-bottom">
							<div className="mm-survey-container">
								<div className="mm-survey-page active" data-page="1">
									<div className="mm-survery-content">
										<div className="mm-survey-question">
											<p>다음 내용을 입력해주세요.</p>
										</div>
										{/* name으로 값 보내면 됨. */}
										<div className="mm-survey-item">
											<span>나이</span><input className='medical-input' data-item="1" type="text" name="age" 
												value={age} onChange={handleChange(setAge)} />
										</div>
										<div className="mm-survey-item">
											<span>키(cm)</span><input className='medical-input' data-item="1" type="text" name="height"
												value={height} onChange={handleChange(setHeight)} />
										</div>
										<div className="mm-survey-item">
											<span>몸무게</span><input className='medical-input' data-item="1" type="text" name="weight"
												value={weight} onChange={handleChange(setWeight)} />
										</div>
										<div className="mm-survey-item">
											<span>혈당</span><input className='medical-input' data-item="1" type="text" name="glucose"
												value={glucose} onChange={handleChange(setGlucose)} />
										</div>
										<div className="mm-survey-item">
											<span>혈압</span><input className='medical-input' data-item="1" type="text" name="bloodPressure"
												value={bloodPressure} onChange={handleChange(setBloodPressure)} />
										</div>
										<div className="mm-survey-item">
											<span>가장 높은 심장 박동수</span><input className='medical-input' data-item="1" type="text" name="thalach"
												value={thalach} onChange={handleChange(setThalach)} />
										</div>
										<div className="mm-survey-item">
											<span>최근 진단 받은 콜레스테롤 수치</span><input className='medical-input' data-item="1" type="text" name="chol"
												value={chol} onChange={handleChange(setChol)} />
										</div>
									</div>
								</div>


								
								<div className="mm-survey-page" data-page="2">
									<div className="mm-survery-content">
										<div className="mm-survey-question">
											<p>임신 경험이 있나요?</p>
										</div>
										<div className="mm-survey-item">
											<input type="radio" id="radio01" name="pregnancies" data-item="2" value="1" onChange={handleChange(setPregnancies)}/>
											<label for="radio01"><span></span><p>예</p></label>
										</div>
										<div className="mm-survey-item">
											<input type="radio" id="radio02" name="pregnancies" data-item="2" value="2" onChange={handleChange(setPregnancies)}/>
											<label for="radio02"><span></span><p>아니요</p></label>
										</div>
									</div>
								</div>

								
								<div className="mm-survey-page" data-page="3">
									<div className="mm-survery-content">
										<div className="mm-survey-question">
											<p>당뇨병을 가진 가족이 있나요?</p>
										</div>
										<div className="mm-survey-item">
											<input type="radio" id="radio03" name="diabetesPedigreeFunction" data-item="3" value="1" onChange={handleChange(setDiabetesPedigreeFunction)}/>
											<label for="radio03"><span></span><p>예</p></label>
										</div>
										<div className="mm-survey-item">
											<input type="radio" id="radio4" name="diabetesPedigreeFunction" data-item="3" value="2" onChange={handleChange(setDiabetesPedigreeFunction)}/>
											<label for="radio4"><span></span><p>아니요</p></label>
										</div>
									</div>
								</div>


								<div className="mm-survey-page" data-page="4">
									<div className="mm-survery-content">
										<div className="mm-survey-question">
											<p>운동을 할 때 가슴에 통증을 느낀 적이 있나요?</p>
										</div>
										<div className="mm-survey-item">
											<input type="radio" id="radio05" name="exang" data-item="4" value="1" onChange={handleChange(setExang)}/>
											<label for="radio05"><span></span><p>예</p></label>
										</div>
										<div className="mm-survey-item">
											<input type="radio" id="radio6" name="exang" data-item="4" value="2" onChange={handleChange(setExang)}/>
											<label for="radio6"><span></span><p>아니요</p></label>
										</div>
									</div>
								</div>


								<div className="mm-survey-page" data-page="5">
									<div className="mm-survery-content">
										<div className="mm-survey-question">
											<p>팔 두께가 정상 범위에 해당하나요?</p>
										</div>
										<div className="mm-survey-item">
											<input type="radio" id="radio07" name="skinThickness" data-item="5" value="1" onChange={handleChange(setSkinThickness)}/>
											<label for="radio07"><span></span><p>예</p></label>
										</div>
										<div className="mm-survey-item">
											<input type="radio" id="radio08" name="skinThickness" data-item="5" value="2" onChange={handleChange(setSkinThickness)}/>
											<label for="radio08"><span></span><p>아니요</p></label>
										</div>
									</div>
								</div>


								<div className="mm-survey-page" data-page="6">
									<div className="mm-survery-content">
										<div className="mm-survey-question">
											<p>인슐린 수치가 정상 범위인가요?</p>
										</div>
										<div className="mm-survey-item">
											<input type="radio" id="radio09" name="insulin" data-item="6" value="1" onChange={handleChange(setInsulin)}/>
											<label for="radio09"><span></span><p>예</p></label>
										</div>
										<div className="mm-survey-item">
											<input type="radio" id="radio10" name="insulin" data-item="6" value="2" onChange={handleChange(setInsulin)}/>
											<label for="radio10"><span></span><p>아니요</p></label>
										</div>
									</div>
								</div>

								<div className="mm-survey-page" data-page="7">
									<div className="mm-survery-content">
										<div className="mm-survey-question">
											<p>가슴에 통증 또는 불편함을 느낀 적이 있나요?</p>
										</div>
										<div className="mm-survey-item">
											<input type="radio" id="radio11" name="cp" data-item="7" value="1" onChange={handleChange(setCp)}/>
											<label for="radio11"><span></span><p>예</p></label>
										</div>
										<div className="mm-survey-item">
											<input type="radio" id="radio12" name="cp" data-item="7" value="2" onChange={handleChange(setCp)}/>
											<label for="radio12"><span></span><p>아니요</p></label>
										</div>
									</div>
								</div>


								<div className="mm-survey-page" data-page="8">
									<div className="mm-survery-content">
										<div className="mm-survey-question">
											<p>심한 운동 후에 특별히 더 피곤하거나 불편함을 느낀 적이 있나요?</p>
										</div>
										<div className="mm-survey-item">
											<input type="radio" id="radio13" name="oldpeak" data-item="8" value="1" onChange={handleChange(setOldpeak)}/>
											<label for="radio13"><span></span><p>예</p></label>
										</div>
										<div className="mm-survey-item">
											<input type="radio" id="radio14" name="oldpeak" data-item="8" value="2" onChange={handleChange(setOldpeak)}/>
											<label for="radio14"><span></span><p>아니요</p></label>
										</div>
									</div>
								</div>

								<div className="mm-survey-page" data-page="9">
									<div className="mm-survery-content">
										<div className="mm-survey-question">
											<p>운동 후에도 오랫동안 피로하거나 기운이 없는 경우가 많나요?</p>
										</div>
										<div className="mm-survey-item">
											<input type="radio" id="radio15" name="slope" data-item="9" value="1" onChange={handleChange(setSlope)}/>
											<label for="radio15"><span></span><p>예</p></label>
										</div>
										<div className="mm-survey-item">
											<input type="radio" id="radio16" name="slope" data-item="9" value="2" onChange={handleChange(setSlope)}/>
											<label for="radio16"><span></span><p>아니요</p></label>
										</div>
									</div>
								</div>

								<div className="mm-survey-page" data-page="10">
									<div className="mm-survery-content">
										<div className="mm-survey-question">
											<p>심장 검사에서 혈관에 문제가 있다고 들은 적이 있나요?</p>
										</div>
										<div className="mm-survey-item">
											<input type="radio" id="radio17" name="ca" data-item="10" value="1" onChange={handleChange(setCa)}/>
											<label for="radio17"><span></span><p>예</p></label>
										</div>
										<div className="mm-survey-item">
											<input type="radio" id="radio18" name="ca" data-item="10" value="2" onChange={handleChange(setCa)}/>
											<label for="radio18"><span></span><p>아니요</p></label>
										</div>
									</div>
								</div>


								<div className="mm-survey-page" data-page="11">
									<div className="mm-survery-content">
										<div className="mm-survey-question">
											<p>혈액과 관련된 특별한 질병을 진단받은 적이 있나요?</p>
										</div>
										<div className="mm-survey-item">
											<input type="radio" id="radio19" name="thal" data-item="11" value="1" onChange={handleChange(setThal)}/>
											<label for="radio19"><span></span><p>예</p></label>
										</div>
										<div className="mm-survey-item">
											<input type="radio" id="radio20" name="thal" data-item="11" value="2" onChange={handleChange(setThal)}/>
											<label for="radio20"><span></span><p>아니요</p></label>
										</div>
									</div>
								</div>

								<div className="mm-survey-page" data-page="12">
									<div className="mm-survery-content">
										<div className="mm-survey-question">
											<p>심전도 검사에서 특이 사항을 발견한 적이 있나요?</p>
										</div> 
										<div className="mm-survey-item">
											<input type="radio" id="radio21" name="restecg" data-item="12" value="1" onChange={handleChange(setRestecg)}/>
											<label for="radio21"><span></span><p>예</p></label>
										</div>
										<div className="mm-survey-item">
											<input type="radio" id="radio22" name="restecg" data-item="12" value="2" onChange={handleChange(setRestecg)}/>
											<label for="radio22"><span></span><p>아니요</p></label>
										</div>
									</div>
								</div>

								<div className="mm-survey-page" data-page="13">
									<div className="mm-survery-content">
										<div className="mm-survey-question">
											<p>성별을 선택하세요</p>
										</div>
										<div className="mm-survey-item">
											<input type="radio" id="radio23" name="gender" data-item="13" 
												value="M" checked={gender === 'M'}  onChange={handleChange(setGender)}/>
											<label for="radio23"><span></span><p>남성</p></label>
										</div>
										<div className="mm-survey-item">
											<input type="radio" id="radio24" name="gender" data-item="13"
												value="F" checked={gender === 'F'} onChange={handleChange(setGender)}/>
											<label for="radio24"><span></span><p>여성</p></label>
										</div>
									</div>
								</div>
								

								
							</div>

							<div className="mm-survey-controller">
								<div className="mm-prev-btn">
									<button>Prev</button>
								</div>
								<div className="mm-next-btn">
									<button disabled="true">Next</button>
								</div>
								<div className="mm-finish-btn">
									<button>Submit</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</form>
		</div>
    </>
  );
}

export default Medical;

