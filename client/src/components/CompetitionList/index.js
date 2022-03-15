import React, {useState, useEffect} from "react";
import axios from "axios";
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'
import No_IMAGE from '../../assets/image/no-image.JPG';
import Spinner from 'react-bootstrap/Spinner';
import { SERVER_URL } from "../../util/Constants";
const CompetitionList = (props) => {
    const [isLoading, setIsLoading] = useState(true);
    const [competitions, setCompetitions] = useState([]);
    const [plan, setPlan] = useState('TIER_ONE');
    const [error, setError] = useState(null);

    useEffect(()=>{
        getCompetitionsList()
    }, [plan]);

    const getCompetitionsList = async () => {
        await axios.get(SERVER_URL+`/get-competitions?plan=${plan}`,{
            timeout: 20000 // timeout after 20 seconds
        })
        .then(response => {
            setCompetitions(response.data.competitions);
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
                                    competitions.length > 0
                                    ?
                                    competitions.map(competition => 
                                        <Col sm={4} key={competition.id}>
                                            <Card className="cr-pointer" style={{ width: '18rem' }} onClick={()=>props.onCompetitonClick(competition.id)}>
                                                <Card.Img variant="top" src={competition.emblemUrl ? competition.emblemUrl : No_IMAGE} />
                                                <Card.Body>
                                                    <Card.Title>{competition.name}</Card.Title>
                                                    <Card.Subtitle className="mb-2 text-muted">{competition.plan}</Card.Subtitle>
                                                    {/* <Row><Col>Position</Col><Col xs={1}>:</Col><Col>{player.position}</Col></Row> */}
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    )
                                    :
                                        <Col className="text-center">No competition available.</Col>
                        }
                        
                    </Row>
                </Container>
    )
}

export default CompetitionList;