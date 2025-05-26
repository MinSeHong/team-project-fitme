import React, { useState,useEffect,useRef} from 'react';
import axios from 'axios'; //npm install axios
import { useNavigate } from "react-router-dom";

import Header from '../../component/header/Header';
import HeaderTop from '../../component/headerTop/HeaderTop';
import './Diet.css';

import Breadcumb from '../../component/Breadcumb/Breadcumb';
import img_diet from '../../../assets/images/breadcumb/diet.jpg';

//크루셀 npm i react-owl-carousel
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

//datepicker사용
//npm install @mui/x-date-pickers
//npm install @mui/material @emotion/react @emotion/styled
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import 'dayjs/locale/ko'

//npm install react-calendar
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from "moment";
//npm install dayjs
import dayjs from 'dayjs';
//npm install sweetalert
import swal from 'sweetalert';

import 'material-symbols';

//componants
import Modal from "./modal";
import FileUploadBox from './FileUploadBox';
import AutoCompleteSearch from './AutoCompleteSearch'
import Chatbot from '../../component/chatBot/ChatBot';

//chart.js
import { Chart as ChartJS,
	RadialLinearScale,
	BarElement,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	ArcElement, 
	Tooltip, 
	Filler,
	Legend } from 'chart.js';
import { Bar,Line } from 'react-chartjs-2';
  
//기본 Line 차트
//https://react-chartjs-2.js.org/examples/line-chart
ChartJS.register(RadialLinearScale,CategoryScale,CategoryScale,LinearScale,BarElement,PointElement,LineElement,ArcElement,Title, Tooltip, Filler,Legend);

export const options = {
	responsive: true,
	plugins: {
		legend: {
		},
		title: {
		display: true,
		text: '',
		},
	},
};

var id = null;
var ipAddress = '192.168.0.53';

//이미지서버 연결 
async function imageData(code){
	return await new Promise((resolve,reject)=>{
	  try{
		axios.get(`http://192.168.0.53:5050/image/${code}`)
		.then((response)=>{
			resolve("data:image/png;base64,"+response.data['image']);
		})
	  }
	  catch(err){reject(err)};
	},2000);
  }

//diet
function Diet() {
	const [mark, setMark] = useState([]);
	const [selectedFood, setSelectedFood] = useState('');
	
	//유저 정보
	const [accountData, setAccount ] = useState([]);

	//다이어트 캘린더용
	const [dietCal,setDietCal] = useState();

	//네비게이트 
	const navigate = useNavigate();

	//모달창 업데이트 딜리트 출력
	const [isOpen, setIsOpen] = useState();
	const [selectOne, setSelect ] = useState();

	//하루 데이타
	const [value, onChange] = useState(new Date());
	const [data1_, setData1] = useState();
	const [data2_, setData2] = useState();
	const [labels1_, setLabels1] = useState();
	const [labels2_, setLabels2] = useState();
	const [mealTime, setMealTime ] = useState([]);

	//추천 데이타
	const [recommendData, setRecommendData] = useState();
	const [recommendChart, setRecommendChart] = useState();
	const [youtubeLink,setYoutubeLink] = useState();

	//사진데이타 
	const setYoloFood=(e)=>{
		setSelectedFood(e);
	}
	//로그인 확인
	useEffect(()=>{
		function getCookie(name) { //로그인 여부 확인
			const cookies = document.cookie.split(';');
			for (let i = 0; i < cookies.length; i++) {
			  const cookie = cookies[i].trim();
			  if (cookie.startsWith(name + '=')) {
				return cookie.substring(name.length + 1);
			  }
			}
			return null;
		  }
		  
		const myCookieValue = getCookie('Authorization');
		if(myCookieValue == null){ //로그인 확인
		navigate('/signin');
		}

		axios.get(`/api/v1/foodworks/account`, {
		headers: {
			'Authorization' : `${myCookieValue}`,
			'Content-Type' : 'application/json; charset=UTF-8'
		}
		})
		.then(response => {
			var proflieData = response.data;
			if(proflieData.accountNo != null) setDietCal(proflieData.accountNo);
			if(proflieData.image!=null){
				imageData(proflieData.image).then((test)=>{
					proflieData.image = test;
					setAccount(proflieData);
				})
			}else{
				imageData(1).then((test)=>{
					proflieData.image = test;
					setAccount(proflieData);
				})
			}
		})
		.catch(error => console.log('error',error))
		
	},[]);

	//모달창 외부 스크롤 방지
	useEffect(() => {
        // Add or remove the 'no-scroll' class to the html and body elements based on the modal's open state
        if (isOpen) {
          document.documentElement.style.overflow = 'hidden';  // Prevent scrolling on html
          document.body.style.overflow = 'hidden';  // Prevent scrolling on body
        } else {
          document.documentElement.style.overflow = 'auto';  // Allow scrolling on html
          document.body.style.overflow = 'auto';  // Allow scrolling on body
        }
        // Cleanup: Remove the added classes when the component unmounts or modal is closed
        return () => {
          document.documentElement.style.overflow = 'auto';  // Ensure scrolling is allowed on html on unmount
          document.body.style.overflow = 'auto';  // Ensure scrolling is allowed on body on unmount
        };
      }, [isOpen]);


	//캘린더 부분 추가
	useEffect(()=>{
		//프로필 코드 
		if(dietCal != null){
			callis(dietCal);
			recommend(dietCal);
		}
	},[dietCal])
	function callis(accountNo,date){
		axios.get(`http://${ipAddress}:5000/account/${accountNo}?hobby=diet`)
		.then(response =>{
			//날짜 일정 추가 창
			setMark(response.data['diet']);
			today(accountNo,date != null ? date : new Date());
			return response.data;
		})
	}
	//하루 데이타
	useEffect(() => {
		setMealTime([]);
		if(dietCal != null){
			today(dietCal,value);
		}
	},[value]);
	
	function today(accountNo,todaydate){
		axios.get(`http://${ipAddress}:5000/diet/${accountNo}?date=`+moment(todaydate).format("YYYY-MM-DD")) //<---머지시 50 을 44로 변경
		.then(response =>{
			setMealTime(response.data['foodDiary']);
	
			var data1_ =[];
			var labels1_ = [];
			var data2_ =[];
			var labels2_ = [];
			for(let i=0; i<response.data['chart2'].length;i++){
			data1_.push(response.data['chart1'][i].size);
			labels1_.push(response.data['chart1'][i].name);
			data2_.push(response.data['chart2'][i].size);
			labels2_.push(response.data['chart2'][i].name);
			}
			setData1(data2_);
			setLabels1(labels2_);
	
			return response.data['chart3'];
		})
		.then(message =>{
			var data1_ =[];
			var labels1_ = [];
			for(let i=0; i<message.length;i++){
				data1_.push(message[i].size);
				labels1_.push(message[i].name);
			} 
			setData2(data1_);
			setLabels2(labels1_);
		});
	}

	//VIEW
	useEffect(()=>{
		if(isOpen != 'true'){
			setFormData([]);
			var list_ = new Array();
			if(dietCal != null){
			  axios.get(`http://${ipAddress}:5000/diet/${dietCal}?calId=${isOpen}`)
			  .then(response =>{
				if(response.data != null){
				  for(var i = 0; i < response.data.length; i++){
					list_.push(response.data[i]);
				  }
				}
				setSelect(list_);
			  })
			}
		}
	},[isOpen])
	//DELETE
	const setCalDel = (e) => {
		if(true){ //confirm넣을자리
			axios.delete(`http://${ipAddress}:5000/diet/${selectOne[0]}`)
			.then(response => {
				setIsOpen(false);
				callis(dietCal,value);
			})
		}
	}

	const toggleModal = (e) => {
		id = e.target.parentElement.children[1] != null ? e.target.parentElement.children[1].value : true;
		setIsOpen(id);
	};

	const handleFoodSelect = value => {
		setSelectedFood(value);
	  };

	const handleImageChange = (image) => {
		setFormData({
		...formData,
		DIET_IMAGE: image, // 이미지 정보를 formData에 추가
		});
	};
	
	const handleSubmit = (e) => {
		e.preventDefault();
		const formData2 = e.target;
		const formData1 = new FormData();
		// 각 폼 필드를 FormData 객체에 추가
		if (selectedFood != null || selectedFood != 0) formData.FOOD = selectedFood;
		for (const key in formData) {
			formData1.append(key, formData[key]);
		}
	
		if(formData2[formData2.length -2].value == '수정'){
		var endTime = e.target.children[2].children[0].children[0].children[1].children[0].value;
      	var accountNo = e.target.children[0].value;
		formData1.append('END_DATE', endTime);
	
		axios.put(`http://${ipAddress}:5000/diet/${accountNo}`, formData1, {
			headers: {
			'Content-Type': 'multipart/form-data',
			},
		})
		.then(response => {
			swal({title:"수정 성공!",icon:"success"})
			//서버에 데이터 입력 성공시 모달창 닫기
			callis(dietCal,value);
			setIsOpen(false);
		})
		.catch(error => {
			swal({title:"입력 실패",icon:"error"})
		});
		}else{
			var endTime = String(e.target.children[1].children[0].children[0].children[1].children[0].value).split()[0]
			formData1.append('END_DATE', endTime);
			setSelectedFood('');
			axios.post(`http://${ipAddress}:5000/diet/${dietCal}`, formData1, {
				headers: {
				'Content-Type': 'multipart/form-data',
				},
			})
			.then(response => {
				swal({title:"입력 성공!",icon:"success"})  
				callis(dietCal,value);
				//서버에 데이터 입력 성공시 모달창 닫기
				setIsOpen(false);
			})
			.catch(error => {
				console.error('서버 오류:', error);
				swal({title:"입력 실패",icon:"error"})
			});
		
		}
	};

	//좋아요
	const foodLike = (e) => {
		var btnLike = e.target.parentElement.children[0].value;
		var dateLike = e.target.parentElement.children[1].value;
		if(dateLike.length <= 0){
			axios.post(`http://${ipAddress}:5000/calendarLike/`+btnLike,{
				headers: {
					'Content-Type':'multipart/form-data',
				}
			})
		e.target.src = require('./images/heart.png');
		e.target.parentElement.children[1].value =new Date();
		}else{
			axios.delete(`http://${ipAddress}:5000/calendarLike/`+btnLike,{
				header: {
					'Content-Type':'multipart/form-data',
				}
			})
		e.target.src = require('./images/empty-heart.png');
		e.target.parentElement.children[1].value ='';
		}
	}

	const [formData, setFormData] = useState({
		DESCRIPTION: '',
		FOOD: '',
		FOOD_WEIGHT: '',
		MEMO: '',
		DIET_IMAGE: ''
	  });

	  
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({
		...formData,
		[name]: value,
		});
	};

	//chart.js data
	const data2 = {
		labels:labels2_,
		datasets: [
		{
			label: '섭취 시간',
			data: data2_,
			borderColor: 'rgb(255, 99, 132)',
			backgroundColor: 'rgba(255, 99, 132, 0.5)',
		},
		],
	};
	const data1 = {
		labels:labels1_,
		datasets: [
		{
			fill: true,
			label: '하루 영양소 섭취량',
			data: data1_,
			borderColor: 'rgb(255, 99, 132)',
			backgroundColor: 'rgba(255, 99, 132, 0.5)',
		},
		],
	};

	//추천값 받아오기
	function recommend(accountNo){
		if(accountNo != null){
			axios.get(`http://${ipAddress}:5000/recommend/${accountNo}`) 
			.then((res)=>{
				setRecommendData(res.data.items); //추천값들을 뿌려주기 위한 변수
			})
		}
	}
	//추천 음식 차트에 뿌려주기 위해서
	function recommendFoodChart(e){
		setYoutubeLink();
		axios.get(`http://${ipAddress}:5000/youtube/${e.target.textContent}`) //axios
		.then(res=>{
			setYoutubeLink(res.data);
		})
		const recommendDataNutrients = recommendData.find(item=> item.food == e.target.textContent).rank.slice(2);
		const weight_kg = accountData.weight;
		const recommendationsRatio = {
			'에너지(kcal)': parseInt(recommendDataNutrients[0])/(calculateBmr() * 0.3)*100,   // 예시로 에너지는 전체 칼로리 중 30%로 설정
			'수분(g)': parseInt(recommendDataNutrients[1])/(weight_kg * 30)*100 ,  // 체중(kg)에 따른 수분 섭취량 (예시)
			'단백질(g)': parseInt(recommendDataNutrients[1])/(weight_kg * 1.2)*100,  // 체중(kg)에 따른 단백질 섭취량 (예시)
			'지방(g)': parseInt(recommendDataNutrients[1])/ (weight_kg * 0.8) * 100,  // 체중(kg)에 따른 지방 섭취량 (예시)
			'회분(g)': parseInt(recommendDataNutrients[1])/200*100, // 예시로 고정된 회분 섭취량 설정
			'탄수화물(g)': parseInt(recommendDataNutrients[1])/ (weight_kg * 3.5) * 100,  // 체중(kg)에 따른 탄수화물 섭취량 (예시)
		}
		setRecommendChart(recommendationsRatio); //추천 음식의 영양소 저장
	}
	//BMR 공식
	function calculateBmr(){
		let bmr = 0;
		if(accountData.gender==='M')
        	bmr = 10 * accountData.weight + 6.25 * accountData.height - 5 * accountData.age + 5
		else
			bmr = 10 * accountData.weight + 6.25 * accountData.height - 5 * accountData.age - 161
    	return bmr;
	}
	//차트 데이타
	const recommendChartData = {
		labels:['에너지(kcal)','수분(g)','단백질(g)','지방(g)','회분(g)','탄수화물(g)'],
		datasets: [
			{
				label: '영양소',
				data: recommendChart,
				borderColor: 'rgb(255, 99, 132)',
				backgroundColor: 'rgba(255, 99, 132, 0.5)',
			},
		],
	};



  return (
    <div>
        <HeaderTop/>
        <Header/>
        <Breadcumb title="Diet" content="Management"  img_title={img_diet}/>
        <div className="blog-area style-two">
            
	<div className="container">
    <div className="col-lg-12 d-flex justify-content-center">
            <div className="row">
			<div className="col-lg-6 col-md-12" style={{ width: "200px" }}>
				<div className="sidebar-box">
						<div className="profile-image-box">
						<img class="profile-icon" src={accountData.image}
							width="200px" height="200px" alt="profile-icon"/>
						</div>
						<div className="profile-name">{accountData.name}</div>
						<div className="profile-description">
							<div className="profile-description-item">
								<span className="text-style-title">Height</span><br/>
								<span className="text-style-description">{accountData.height}</span>
							</div>
							<div className="profile-description-item">
								<span className="text-style-title">Weight</span><br/>
								<span className="text-style-description">{accountData.weight}</span>
							</div>
							<div className="profile-description-item">
								<span className="text-style-title">Gender</span><br/>
								<span className="text-style-description">{accountData.gender==='M'?'남성':'여성'}</span>
							</div>
							<div className="profile-description-item">
								<span className="text-style-title">Age</span><br/>
								<span className="text-style-description">{accountData.age}</span>
							</div>
						</div>
					</div>
				</div>
            <div className="col-lg-6 col-md-12" style={{ width: "600px" }}>
				<div className="react-calendar-layout">
					<Calendar 
					calendarType='gregory'
					onChange={onChange}
					className="mx-auto w-full text-sm border-b"
					navigationLabel={null}
					showNeighboringMonth={false}
					formatDay ={(locale, date) =>{
						return dayjs(date).format('DD')}}
					tileContent={({ date, view }) => { // 날짜 타일에 컨텐츠 추가하기 (html 태그)
						// 추가할 html 태그를 변수 초기화
						let html = [];
						// 현재 날짜가 post 작성한 날짜 배열(mark)에 있다면, dot div 추가
						if (mark.find((x) => x === moment(date).format("YYYY-MM-DD"))) {
						html.push(<div className="dot"></div>);
						}
						// 다른 조건을 주어서 html.push 에 추가적인 html 태그를 적용할 수 있음.
						return (
						<>
							<div className="flex justify-center items-center absoluteDiv">
							{html}
							</div>
						</>
						);
					}}
					value={value} />
				</div>
            	</div>
				</div>
            </div>

			</div>
			
		<div className="container">

		<div className='chart-info-container'style={{height: 500, marginBottom: 50}}>
				<div className="main-titles-chart">
					<h2>CHART DESCRIPTION</h2>
				</div>
				<div className='chart-info-left' style={{height: 300}}>
					<Bar options={options} data={data2} />
				</div>
				<div className='chart-info-right' style={{height: 300}}>
					<Line options={options} data={data1} />
				</div>
		</div>

		<div className="row">
				<div className="col-lg-12">
					<div className="section-titles">
						<div className="main-titles">
							<h2>FOOD DIARY</h2>
						</div>
					</div>
				</div>
			</div>

			<OwlCarousel key={mealTime.length} items={3}  margin={20} autoplay autoplayTimeout={5000} autoplayHoverPause nav navText={["<i class='fa fa-chevron-left'/>","<i class='fa fa-chevron-right'/>"]} dots >
				{mealTime.map((test,index)=>(
				<div className="item" key={index}>
					<div className="row">
						<div className="col-lg-12">
							<div className="blog-single-box">
								<div className="blog-thumb">
									<div type="button" className="edit-siksa-button" onClick={toggleModal}>
										<img src={test[4]} alt="pizza"/>
										<input type='hidden' value={test[0]} />
									</div>
									{/*
									<div class="blog-btn">
										<a href="#">아침</a>
									</div>
									*/}
								</div>
								<div className="blog-content">
									<div className="blog-left">
										<span>{test[3]}</span>
									</div>
									<h2>{test[1]}</h2>
									<p>{test[2]}</p>
									<p>{test[5]}</p>
									<div className="blog-button" >
										<div type="button" className="like-button" onClick={foodLike}>
											<input type='hidden' value={test[0]} />
											<input type='hidden' value={test[6]} />
											{
											test[6] != null?
												<img src={require('./images/heart.png')} alt="like"/>
												:
												<img src={require('./images/empty-heart.png')} alt="like"/>
											}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				))}
			</OwlCarousel>		

			<div>
			<button type="button" className="add-siksa-button" onClick={toggleModal}>
			<div className="add-siksa-icon" style={{ backgroundImage: `url(${require('./images/plus6.png')})` }}></div>
			</button>
			
			{/* 음식추천 */}
			<div className='ai-container' >
				<div className="main-titles-ai">
					<h2>AI RECOMMENDATIONS</h2>
				</div>
				<div className='list-container-ai'>
				<ol>
					{recommendData && recommendData.map((food,index)=>(
						<li onClick={recommendFoodChart} key={index}>{food.food}</li>	
					))}

				</ol>
				</div>
				<div className='chart-info-container-ai' style={{width : 600,height: 400,marginTop:0}}>
					<div className='chart-info-left-ai' style={{height: 300}}>
						<Bar options={options} data={recommendChartData} />
					</div>
				</div>
				<div className="recommend-layout">
					{youtubeLink && youtubeLink.map((link,index)=>(
						<div className="recommend-container" key={index}>
							<iframe src={link.url}></iframe>
							<span className="material-symbols-outlined" id='yt-save-button'>arrow_circle_down</span>
						</div>
					))}
				</div>
			</div>

			{isOpen && (
                <Modal
                  open={isOpen}
                  onClose={() => {
                    setSelectedFood('');
                    setIsOpen(false);
                  }}
                > 
                <div className="modal-addfood-label">
                  <h2>맛있는 음식을 추가해 주세요!</h2>
                </div>
                <form onSubmit={handleSubmit} onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}>
                  {selectOne == '' || selectOne == null ? ''
                    : 
                    <input type="hidden" value={selectOne[0]}/>
                  }
                  <div className="file_upload_diet">
                  <FileUploadBox setFile={setYoloFood} onImageChange={handleImageChange} />
                  </div>
                  <div className="date_picker">
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
                    <DemoContainer components={['DateTimePicker']}>
                    <DateTimePicker 
                    label="날짜와 시간 설정" 
                    value={dayjs(selectOne == '' || selectOne == null ? moment(value).format("YYYY-MM-DD 00:00") : selectOne[5])}
                    slotProps={{
                      textField: {
                        size: "small",
                        format: 'YYYY-MM-DD HH:mm'
                      },
                    }}
                    />
                    </DemoContainer>
                    </LocalizationProvider>
                    </div>
                    <div className="date_picker">
                      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">

                      </LocalizationProvider>
                      </div>
                    <div className="modal-food-list">
                      <AutoCompleteSearch onSelect={handleFoodSelect} />
                      <input type="text" name="DESCRIPTION" 
					  value={formData.DESCRIPTION != null ? formData.DESCRIPTION : selectOne != null ? selectOne[1] : ''}
					   placeholder="제목" onChange={handleInputChange} />
                      <input type="text" name="FOOD" 
					  value={(selectedFood != null && selectedFood.length != 0)? selectedFood : selectOne != null ? selectOne[3]:''}
					   placeholder="음식" onChange={handleInputChange} readOnly/>
                      <input type="text" name="FOOD_WEIGHT" 
					  value={formData.FOOD_WEIGHT != null ? formData.FOOD_WEIGHT : selectOne != null ? selectOne[7] : ''} 
					  placeholder="음식무게" onChange={handleInputChange} />
                      <input type="text" name="MEMO" 
					  value={formData.MEMO != null ? formData.MEMO : selectOne != null ? selectOne[2] : ''} 
					  placeholder="내용" onChange={handleInputChange} />
                    </div>
                    <div className="modal-food-chart">
                    </div>

					<div style={{display:'flex',width:'250px',marginLeft: '340px',alignItems: 'center'}}>
                   
				    <input type="submit"
					value={selectOne != '' ? "수정": "등록"} 
					className="submit-btn-modal"/>
                    {selectOne == '' ? ''
                      : 
                      <input type="reset" value="삭제" 
					  onClick={setCalDel} 
					  className="reset-btn-modal" style={{marginTop:'10px'}}/>
                    }
				</div>
                  </form>
                </Modal>
                )}
				</div>
				<Chatbot/>
			</div>
		</div>
    </div>
	

  );
}

export default Diet;