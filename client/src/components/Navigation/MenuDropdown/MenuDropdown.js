import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import useAuthContext from '../../../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';

const PROFILE_DIV = styled.div`
    width: 300px;
    min-height: 200px;
    border-color: rgba(72, 94, 144, 0.16);
    box-shadow: 0 2px 3px rgb(28 39 60 / 6%);
    margin-top: 40px;
    right: 0px;
    position: absolute;
    border: 1px solid #cccccc;
    border-radius: .25rem;
    background-color: #fff;
    float: right;

    .col-md-12 {
        max-width: 100%;
        flex: 0 0 100%;
        -moz-box-flex: 0;
        -webkit-box-flex: 0;
    }

    .border-bt {
        border-bottom: 1px solid #E6E6E6;
        text-align: center;
        padding-bottom: 10px;
    }

    .clearBoth {
        clear: both;
    }

    .UL-profile-menu ul li a {
        color: #666E78;
    }
`;
const MenuDropdown = (props) => {
    const { authTokens, setAuthTokens } = useAuthContext();
    const navigate = useNavigate();
    const [isLoggedOut, setLoggedOut] = useState(false);

    useEffect(()=>{
        if (isLoggedOut) {
            setAuthTokens(null);
            localStorage.clear()
            navigate('/login');
        }
    },[isLoggedOut])
    

    return (
        <div id={`menu-${props.id}`} className={` pos-relative ${props.open ? 'd-block' : 'd-none'}`}>
            <PROFILE_DIV>
                <div className="col-md-12" style={{marginTop:'40px'}}>
                    <div className="border-bt clearBoth">
                        <h2>{authTokens.user.name}</h2>
                        <div>{authTokens.user.email}</div>
                    </div>
                </div>
                <div className="ul-col-md-12">
                    <div className='profile-menu' style={{padding:'10px'}}>
                        <ul>
                            <li className='cr-pointer' onClick={()=>setLoggedOut(true)}>Logout</li>
                        </ul>                        
                    </div>
                </div>
            </PROFILE_DIV>
        </div>        
    )
}

export default MenuDropdown;