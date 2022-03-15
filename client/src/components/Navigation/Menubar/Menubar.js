import React, { useEffect, useState} from 'react';
import './Menubar.css';
import MenuDropdown from '../MenuDropdown/MenuDropdown';
import useAuthContext from "../../../hooks/useAuthContext";
import LanguageSelector from '../../LanguageSelector/LanguageSelector';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Menubar = () => {
        const { authTokens } = useAuthContext();
        const [ open, setOpen ] = useState(false);
        const defaultIcon = <FontAwesomeIcon icon={['fas', 'fa-user']} />

        useEffect(() => {
                const clickHandler = ({ target }) => {
                  const container = document.getElementById(`menu-top`);
                  const profile = document.getElementById(`profile-icon`);
                  if ((container && container.contains(target)) || (profile && profile.contains(target))) return;
                  setOpen(false);
                };
            
                document.addEventListener("click", clickHandler);
            
                // these functions clean up the event listeners
                return () => document.removeEventListener("click", clickHandler);
        },[]);

        return (        
                <header className="mainHeader pos-absolute">
                <div className="wd-100pr DesktopOnly"> 
                {
                        authTokens ? <div className="profile f-right">
                                    <div className="pos-relative avatar-xs mg-l-10 mg-t-5 mg-r-15">
                                        <span id="profile-icon" className="avatar-initial rounded-circle cr-pointer" onClick={ () => setOpen(!open) }>
                                        {defaultIcon}
                                        </span>
                                    </div>
                        </div>
                        : null
                }           
                        
                <MenuDropdown open={open} id="top"/>
                <LanguageSelector class="menu-flags f-right"/>
                </div>
                </header>
        )
};

export default Menubar;