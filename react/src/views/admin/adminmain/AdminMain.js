import {Link, Route} from 'react-router-dom';
import React, { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import '../adminstyle/Aheader.css';

import LeftSidebar from '../admincomponent/LeftSidebar.js';
import AHeaderTop from '../admincomponent/Aheader.js';
import Dashboard from '../admincomponent/Dashboard.js';


import '../adminstyle/Acss/bootstrap.min.css';
import '../adminstyle/Acss/icons.css';
import '../adminstyle/Acss/icons.css.map';
import '../adminstyle/Acss/style.css.map';
import '../adminstyle/Acss/typicons.css';
import '../adminstyle/Acss/typicons.css.map';



function SignUp() {
 

  return (
    <div style={{paddingBottom:'80px'}}>
        <AHeaderTop/>
        <LeftSidebar/>
    </div>    
  );
};
export default SignUp;

