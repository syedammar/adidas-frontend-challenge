import React, {useState, useEffect} from "react";
import axios from "axios";
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import No_IMAGE from '../../assets/image/no-image.JPG';
import Spinner from 'react-bootstrap/Spinner';
import { SERVER_URL } from "../../util/Constants";
const TeamList = (props) => {
    const [isLoading, setIsLoading] = useState(true);
    const [teams, setTeams] = useState([]);
    const [error, setError] = useState(null);

    useEffect(()=>{
        setIsLoading(true)
        setTeams([]);
        getCompetitionTeamList();
    },[props.competitionId]);

    const getCompetitionTeamList = async () => {
      await axios.get(SERVER_URL+`/get-football-teams/${props.competitionId}`,{
          timeout: 20000 // timeout after 20 seconds
      })
      .then(response => {
          setTeams(response.data.data);
          setIsLoading(false);
      })
      .catch(error => {            
          setError(error);
          setIsLoading(false);
      })
    }
    
    return (
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
                            <Col sm={4} key={team.id}>
                                <Card className="cr-pointer" style={{ width: '18rem' }} onClick={()=>props.onTeamClick(team.id)}>
                                    <Card.Img variant="top" src={team.crestUrl ? team.crestUrl : No_IMAGE} />
                                    <Card.Body>
                                        <Card.Title>Team Name: {team.name ? team.name : 'Not available'}</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">Founded In:  {team.founded ? team.founded : 'Not available'}</Card.Subtitle>
                                        {/* <Row><Col>Position</Col><Col xs={1}>:</Col><Col>{player.position}</Col></Row> */}
                                    </Card.Body>
                                </Card>
                            </Col>
                        )
                        :
                            <Col className="text-center">No teams available.</Col>
            }
            
        </Row>
    </Container>
    )

}

export default TeamList;