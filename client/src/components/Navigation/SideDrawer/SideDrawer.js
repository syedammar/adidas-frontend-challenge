import React, {Fragment} from 'react';
import NavigationItemsDrawer from './NavigationItemsDrawer';
import './SideDrawer.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const sideDrawer = () => {
    const barIcon = <FontAwesomeIcon icon={['fas', 'fa-bars']} />
    const menu = [
        {
            "checkAuth": true,
            "id" : "dashboard",
            "label" : "Dasboard",
            "drawer"  : true,
            "link" : "/dashboard",
            "display" : true,
            "icon" : ['fas', 'fa-th-large'],
            "margin" : "mg-t-30",
            "isLanding": true,
            "sections": [],          
            "children": []            
        },
        {
            "checkAuth": true,
            "id" : "selected-players",
            "label" : "Selected Players",
            "drawer"  : true,
            "link" : "/selected-players",
            "display" : true,
            "icon" : ['fas','fa-users'],
            "margin" : false,
            "isLanding": false,
            "sections": [],          
            "children": []            
        },
        {
            "checkAuth": true,
            "id" : "add-players",
            "label" : "Add Players",
            "drawer"  : true,
            "link" : "/add-players",
            "display" : true,
            "icon" : ['fas','fa-user'],
            "margin" : false,
            "isLanding": false,
            "sections": [],          
            "children": []            
        }
    ]
    return (
        <Fragment>
            <input id="slide-sidebar" type="checkbox" role="button" />
            <label htmlFor="slide-sidebar" className="hambargarmenu pos-absolute"><span>{barIcon}</span></label>                
            <NavigationItemsDrawer menus={menu}/>
        </Fragment>        
    );
}

export default sideDrawer;