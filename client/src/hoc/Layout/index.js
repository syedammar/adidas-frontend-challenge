import React from 'react';
import Menubar from '../../components/Navigation/Menubar/Menubar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';
import {useTranslation} from "react-i18next";
import useAuthContext from "../../hooks/useAuthContext";
import LanguageSelector from '../../components/LanguageSelector/LanguageSelector';
import './Layout.css';
import { APPLICATION_NAME } from '../../util/Constants';
import logo from '../../assets/image/logo.svg';
import ErrorBoundary from '../../util/ErrorBoundary';

const Layout = (props) => {
    const {t} = useTranslation('common');
    const { authTokens  } = useAuthContext();
   
     return authTokens ?
            (                
              <div className={`wrapper pos-relative`}>
                  <Menubar/>
                  <div className="main-wrap">
                      <SideDrawer/>
                      
                        <main className="content-right">
                            <ErrorBoundary>
                            { props.children }
                            </ErrorBoundary>
                        </main>
                  </div>                    
              </div>
            )
            :
            (                
                <div className="centerDiv res-login">
                    <div className="innerLogin">
                        <div className="div1">
                            <div className="plateform-text">{ APPLICATION_NAME }</div>
                            <div className="plateform-subtext">{t('welcome.title')}</div>
                            <div className="loginImage"></div>
                        </div>
                        <div className="div2">
                            <div style={{float:'right'}}>
                                <LanguageSelector class="menu-flags-login"/>
                            </div>
                            <div className="logo">
                                <img src={logo} alt="adidas" />
                            </div>                                
                            { props.children }
                        </div>
                    </div>
                </div>
            )
}

export default Layout;