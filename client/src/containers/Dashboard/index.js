import React, {useState, useEffect, Fragment} from "react";
import axios from "axios";
import {useTranslation} from "react-i18next";
import useAuthContext from "../../hooks/useAuthContext";
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import {Link} from "react-router-dom";
import { SERVER_URL } from "../../util/Constants";

const Dashboard = () => {    
    const {t} = useTranslation('common');
    const { authTokens  } = useAuthContext();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [teams, setTeams] = useState([]);
    useEffect(()=>{
        getUserCreatedTeams();
    },[]);

    const getUserCreatedTeams = async () => {
        setIsLoading(true);
        await axios.get(SERVER_URL+'/get-user-team/'+authTokens.user.id)
        .then(response => {
            if (response.data.teams.length > 0) {
                setTeams(response.data.teams);            
            }
            setIsLoading(false);
        })
        .catch(error => {
            console.log(error);
            setError(error);
            setIsLoading(false);
        });
    }

    return (
        <Fragment>
            <div className="page-heading mg-b-10">
                <h1 className="mg-l-10">{t('dashboard.page-heading')}</h1>           
            </div>
            <div className="clearBoth mg-b-50">
                <div className="mg-r-15 mg-l-15 mg-t-20 mg-b-10" style={{minHeight:"800px"}}>
                    <Container>
                        <Row>
                            {
                                isLoading
                                ?
                                <Col className="text-center">
                                    <Spinner animation="border" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </Spinner>
                                </Col>
                                : 
                                    error
                                    ?
                                    <Col className="text-center">{error.message}</Col>
                                    :
                                        teams.length > 0
                                        ?
                                        teams.map(team => 
                                            <Col key={team.id}>
                                                <Card style={{ width: '18rem' }}>
                                                    <Card.Body>
                                                        <Card.Title>{team.userTeamName}</Card.Title>
                                                        <Row><Col xs={6}>Total Player(s)</Col><Col xs={1}>:</Col><Col>{team.userTeamPlayersIds.split(',').length}</Col></Row>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        )
                                        :
                                            <Col className="text-center">You have not created any teams yet visit <Link to="/selected-players">Selected Players</Link> to create your football team.</Col>
                            }
                            
                        </Row>
                    </Container>
                </div>
            </div>
        </Fragment>
    )
}
export default Dashboard;