import AHeaderTop from './Aheader.js'
import LeftSidebar from './LeftSidebar.js';
import DoughnutChart from './AChart/DoughnutChart.js';
import LineChart from './AChart/LineChart.js';

import '../adminstyle/Dashboard.css';


function Dashboard() {
 

  return (
    <div>
      <AHeaderTop/>
        <LeftSidebar/>
        <div className="content-page">
          <div className="content">
            
                    <div className="page-content-wrapper ">

                        <div className="container-fluid">

                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="page-title-box">
                                        <div className="btn-group float-right">
                                            
                                        </div>
                                        <h4 className="page-title">Dashboard</h4>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-lg-9">
                                    <div className="row">
                                        <div className="col-lg-3">
                                            <div className="card">
                                                <div className="card-body">
                                                    <div className="icon-contain">
                                                        <div className="row">
                                                            <div className="col-2 align-self-center">
                                                                <i className="fas fa-tasks text-gradient-success"></i>
                                                            </div>
                                                            <div className="col-10 text-right">
                                                                <h5 className="mt-0 mb-1">190</h5>
                                                                <p className="mb-0 font-12 text-muted">Active Tasks</p>   
                                                            </div>
                                                        </div>                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-3">
                                            <div className="card">
                                                <div className="card-body justify-content-center">
                                                    <div className="icon-contain">
                                                        <div className="row">
                                                            <div className="col-2 align-self-center">
                                                                <i className="far fa-gem text-gradient-danger"></i>
                                                            </div>
                                                            <div className="col-10 text-right">
                                                                <h5 className="mt-0 mb-1">62</h5>
                                                                <p className="mb-0 font-12 text-muted">Project</p>
                                                            </div>
                                                        </div>                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-3">
                                            <div className="card">
                                                <div className="card-body">
                                                    <div className="icon-contain">
                                                        <div className="row">
                                                            <div className="col-2 align-self-center">
                                                                <i className="fas fa-users text-gradient-warning"></i>
                                                            </div>
                                                            <div className="col-10 text-right">
                                                                <h5 className="mt-0 mb-1">14</h5>
                                                                <p className="mb-0 font-12 text-muted">Teams</p>    
                                                            </div>
                                                        </div>                                                        
                                                    </div>                                                    
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-3">
                                            <div className="card ">
                                                <div className="card-body">
                                                    <div className="icon-contain">
                                                        <div className="row">
                                                            <div className="col-2 align-self-center">
                                                                <i className="fas fa-database text-gradient-primary"></i>
                                                            </div>
                                                            <div className="col-10 text-right">
                                                                <h5 className="mt-0 mb-1">$15562</h5>
                                                                <p className="mb-0 font-12 text-muted">Budget</p>    
                                                            </div>
                                                        </div>                                                        
                                                    </div>                                                    
                                                </div>
                                            </div>
                                        </div>                                             
                                    </div> 
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="btn-group btn-group-toggle float-right" data-toggle="buttons">
                                                <label className="btn btn-primary btn-sm active">
                                                    <input type="radio" name="options" id="option1" checked=""/> This Week
                                                </label>
                                                <label className="btn btn-primary btn-sm">
                                                    <input type="radio" name="options" id="option2"/> Last Month
                                                </label>                                                
                                            </div>
                                            <h5 className="header-title mb-4 mt-0">Weekly Record</h5>
                                            <LineChart/>
                                        </div>
                                    </div>                                    
                                </div>
                                <div className="col-lg-3">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="dropdown d-inline-block float-right">
                                                <a className="nav-link dropdown-toggle arrow-none" id="dLabel4" data-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false">
                                                    <i className="fas fa-ellipsis-v font-20 text-muted"></i>
                                                </a>
                                                <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dLabel4">
                                                    <a className="dropdown-item" href="#">Create Project</a>
                                                    <a className="dropdown-item" href="#">Open Project</a>
                                                    <a className="dropdown-item" href="#">Tasks Details</a>
                                                </div>
                                            </div>
                                            <h5 className="header-title mb-4 mt-0">Activity</h5>
                                            <div>
                                                <DoughnutChart/>
                                            </div>
                                            <ul className="list-unstyled list-inline text-center mb-0 mt-3">
                                                <li className="mb-2 list-inline-item text-muted font-13"><i className="mdi mdi-label text-success mr-2"></i>Active</li>
                                                <li className="mb-2 list-inline-item text-muted font-13"><i className="mdi mdi-label text-danger mr-2"></i>Complete</li>
                                                <li className="mb-2 list-inline-item text-muted font-13"><i className="mdi mdi-label text-warning mr-2"></i>Panding</li>
                                            </ul>
                                        </div>                               
                                    </div>
                                    
                                </div>                                
                            </div>
                            <div className="row">
                                
                                <div className="col-xl-4">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="dropdown d-inline-block float-right">
                                                <a className="nav-link dropdown-toggle arrow-none" id="dLabel5" data-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false">
                                                    <i className="fas fa-ellipsis-v font-20 text-muted"></i>
                                                </a>
                                                <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dLabel5">
                                                    <a className="dropdown-item" href="#">New Messages</a>
                                                    <a className="dropdown-item" href="#">Open Messages</a>
                                                </div>
                                            </div>
                                            <h5 className="header-title pb-3 mt-0">New Clients</h5>
                                            <div className="table-responsive boxscroll" >
                                                {/*신규 가입자를 뿌려줄지?*/}
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-4 col-lg-6">
                                    <div className="card">
                                        <div className="card-body">
                                            <a href="#" className="btn btn-outline-success float-right">Withdraw Monthly</a>
                                            <h5 className="header-title mb-4 mt-0">Monthly Revenue</h5>
                                            <h4 className="mb-4">$15,421.50</h4>
                                            <p className="font-14 text-muted mb-4">
                                                <i className="mdi mdi-message-reply text-danger mr-2 font-18"></i>
                                                $ 1500 when an unknown printer took a galley.
                                            </p>                                        
                                            <canvas id="bar-data" height="132"></canvas> 
                                        </div>                         
                                    </div>
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="d-sm-flex align-self-center">
                                                    <img src="assets/images/widgets/code.svg" alt="" className="" height="100"/>
                                                <div className="media-body ml-3">
                                                    <h6>Code Confirmed</h6>
                                                    <p className="text-muted font-13 ">Contrary to popular belief, generators on  Lorem Ipsum is not simply random text.</p>
                                                    <a href="#" className="btn btn-gradient-secondary">Confirm</a>
                                                </div>
                                            </div>                                            
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-4  col-lg-6">
                                    <div className="card timeline-card">
                                        <div className="card-body p-0">                               
                                            <div className="bg-gradient2 text-white text-center py-3 mb-4">
                                                <p className="mb-0 font-18"><i className="mdi mdi-clock-outline font-20"></i> This Week's Activity</p>                                       
                                            </div>
                                        </div>
                                        <div className="card-body boxscroll">
                                            <div className="timeline">
                                                <div className="entry">
                                                    <div className="title">
                                                        <h6>10/ Oct</h6>
                                                    </div>
                                                    <div className="body">
                                                        <p>There are many variations of passages of  Lorem Ipsum available.....<a href="#" className="text-primary"> Read More</a></p>                                                                
                                                    </div>
                                                </div>
                                                <div className="entry">
                                                    <div className="title">
                                                        <h6>9/ Oct</h6>
                                                    </div>
                                                    <div className="body">
                                                        <p>All the Lorem Ipsum generators on the  predefined chunks as necessary.....<a href="#" className="text-primary"> Read More</a></p>                                                                
                                                    </div>
                                                </div>
                                                <div className="entry">
                                                    <div className="title">
                                                        <h6>8/ Oct</h6>
                                                    </div>
                                                    <div className="body">
                                                        <p>Contrary to popular belief, Lorem Ipsum is not simply random text.....<a href="#" className="text-primary"> Read More</a></p>                                                                
                                                    </div>
                                                </div>
                                                <div className="entry">
                                                    <div className="title">
                                                        <h6>7/ Oct</h6>
                                                    </div>
                                                    <div className="body">
                                                        <p className="pb-1">Many desktop publishing packages and web page editors now.....<a href="#" className="text-primary"> Read More</a></p>                                                                
                                                    </div>
                                                </div> 
                                                <div className="entry">
                                                    <div className="title">
                                                        <h6>6/ Oct</h6>
                                                    </div>
                                                    <div className="body">
                                                        <p className="pb-1 mb-0">All the Lorem Ipsum generators on the  predefined chunks as necessary.....<a href="#" className="text-primary"> Read More</a></p>                                                                
                                                    </div>
                                                </div>                                                              
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            
                        </div>

                    </div>

                </div> 
            </div>

    </div>    
  );
};
export default Dashboard;