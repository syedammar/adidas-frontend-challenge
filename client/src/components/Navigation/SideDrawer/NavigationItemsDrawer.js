import React, {Component} from 'react';
import { NavLink } from 'react-router-dom';
import NavigationItem from '../NavigationItem/NavigationItem';
import { APPLICATION_NAME } from '../../../util/Constants';
import logo from "../../../assets/image/logo.svg";

class NavigationItemsDrawer extends Component {
    
    constructor() {
        super();
        this.state = {
            tabState : {}
        }
    }
    
    toggleExpanded = (e, tabTitle, parentTitle, grandParentTitle) => {
        this.setState(prevSate => {
          return {
              tabState :{
                ...prevSate.tabState,
                [tabTitle]: !this.state.tabState[tabTitle]
              }
          }
        });

        this.props.menus.filter((obj) => {
            if (`menu-${obj.id}` === parentTitle || `menu-${obj.id}` === grandParentTitle) {
                return false;
            }
            return true;
        }).map((obj) => {            
            if (`menu-${obj.id}` !== tabTitle) {
                this.setState(prevSate => {
                  return {
                      tabState :{
                        ...prevSate.tabState,
                        [`menu-${obj.id}`]: false
                      }
                  }
                });
            }
        });
    }
    navMenuSections = (sections, parentId, grandParentId='') => {
        return sections.map((section, i) => {
            return <ul key={i} className="collapse list-unstyled">
                        <li>
                            <a data-toggle="collapse" aria-expanded="true">   
                            <span className="lbText UL-sidebar-Hcolor UL-pd-b-10">          
                                {section.label}
                            </span>
                            </a>                            
                            {this.navMenuChildren(section.children, parentId, grandParentId)}                            
                        </li>
                    </ul>
        });
    }
    
    navMenuChildren = (childrens, parentId, grandParentId='') => {
        return childrens.map((menu, i) => {
            return  <ul className="UL-pd-l-15" key={i}>
                        <li className={`${ this.state.tabState[`menu-${menu.id}`] ? 'active': ""}`} onClick={(e) => {e.stopPropagation(); this.toggleExpanded (e, `menu-${menu.id}`, `menu-${parentId}`, `${menu.hasOwnProperty("grandParent") ? `menu-${menu.grandParent}` : ''}`) }}>
                            <NavLink to={menu.link} className="lbText fw-n cl000 Tdecoration pd7">
                                { menu.label }
                                <span className="wd-100pr mg-l-5" style={{display:'inline'}}></span>
                                {
                                    (menu.hasOwnProperty("sections") && menu.sections.length) ||
                                    (menu.hasOwnProperty("children") && menu.children.length)
                                    ?   <i className={`fas fa-angle-${this.state.tabState[`menu-${menu.id}`]? 'down':'right'} pos-relative r-10 t-0 mg-t-6 f-right`}></i>
                                    : null
                                }                                
                            </NavLink>
                            <div className="pd-l-40 pd-t-15 sidenavformate">
                            {                                
                                menu.hasOwnProperty("sections") && menu.sections.length ? this.navMenuSections(menu.sections, menu.id, menu.hasOwnProperty("grandParent") ? menu.grandParent : '') : 
                                                                                            menu.hasOwnProperty("children") && menu.children.length ? this.navMenuChildren(menu.children, menu.id, menu.hasOwnProperty("grandParent") ? menu.grandParent : '') : null
                            } 
                            </div>                                                               
                        </li>
                    </ul>
                    
        })
    }
    
    navMenuhandler = () => {
        return this.props.menus.map((menu, i) => {              
            if (menu.checkAuth)  {    
                return <NavigationItem 
                    key={i}
                    drawer = {menu.drawer}
                    isLanding = {menu.isLanding}
                    link={menu.link} 
                    label = {menu.label}
                    id={menu.id} 
                    display = {menu.display}
                    margin={menu.margin}
                    icon={menu.icon}
                    children={menu.children}
                    sections={menu.sections.length}
                    onClickEvent = {(e, active, id) => this.toggleExpanded(e, `menu-${id}`)}
                    active={this.state.tabState[`menu-${menu.id}`]}
                    reference = {node => this.node = node}
                    >
                        {this.navMenuSections(menu.sections, menu.id)}
                </NavigationItem>
            }
        })
    }
    render() {
        return (
            <div className="sidebar f-left pos-absolute" style={{height:'auto', padding:0, top:0}}>
                <ul className="sidebar-height">
                    <li className="d-flex">
                        <div className="logo">
                            <img src={logo} alt="adidas" />
                        </div>
                        <div className="appname" style={{paddingLeft:'10px', alignSelf:'center'}}>{  APPLICATION_NAME  }</div>
                    </li>
                    {
                        this.navMenuhandler()
                    }
                </ul>                
            </div>
            
        )
    }
    
    

}

export default NavigationItemsDrawer;