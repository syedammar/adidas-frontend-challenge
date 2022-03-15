import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import './NavigationItem.css';
import { LANDING_PAGE } from '../../../util/Constants';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const NavigationItem = (props) => {

    const angleRight = <FontAwesomeIcon icon={['fas', 'fa-angle-right']} className="pos-relative r-10 t-0 mg-t-6 f-right"/>
    const angleDown = <FontAwesomeIcon icon={['fas', 'fa-angle-down']} className="pos-relative r-10 t-0 mg-t-6 f-right"/>
    let location = useLocation();

    return props.drawer  ? 
                    (
                        <li ref={props.reference} id={`menu-${props.id}`} data-toggle="collapse" className={`${props.display ? 'd-block' : 'd-none'} ${props.margin ? props.margin : ''} ${ props.active || (location.pathname === '/dashboard' && props.isLanding) ? 'active': ""}`} onClick={ (e) => props.onClickEvent (e, !props.active, props.id) }>                                
                            <NavLink  to={props.link} className={`cl000 wd-100pr d-block mg-b-10 pd7 ${ props.active || (location.pathname === '/dashboard' && props.isLanding) ? 'active': ""}`}>
                                <span><FontAwesomeIcon icon={[...props.icon]} className="UL-cltextfff UL-pd-r-5"/></span>
                                <span className="lbText tx-white wd-100pr mg-l-5">{props.label}</span>
                                {
                                    props.sections 
                                                    ? props.active || (location.pathname === `/${LANDING_PAGE}` && props.isLanding) ? angleDown : angleRight
                                                    : null
                                }
                            </NavLink>
                            <div className="pd-l-40 pd-t-15 sidenavformate">
                                {props.children}
                            </div>
                        </li>
                    ) 
                    : 
                    (
                        <li id={`menu-${props.id}`} className={`${props.display ? 'd-block' : 'd-none'}`}>
                            <NavLink to={props.link}>
                                {props.children}
                            </NavLink>
                        </li>
                    )
    
}    

export default NavigationItem;