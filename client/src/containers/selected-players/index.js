import React, {useState, useEffect, Fragment, useRef} from "react";
import axios from "axios";
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import useAuthContext from "../../hooks/useAuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from "react-bootstrap/FormControl";
import AlertBox from "../../components/Alert";
import Form from "react-bootstrap/Form";
import { SERVER_URL } from "../../util/Constants";

const SelectedPlayers = () => {
    const { authTokens  } = useAuthContext();
    const [isLoading, setIsLoading] = useState(true);
    const [isTeamCreating, setTeamCreating] = useState(false);
    const [players, setPlayers] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [error, setError] = useState(null);
    const [modalShow, setModalShow] = useState(false);
    const [alertShow, setAlertShow] = useState(false);
    const [alertVariant, setAlertVariant] = useState('danger');
    const [alertHeading, setAlertHeading] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const teamName = useRef(null);
    const checkIcon = <FontAwesomeIcon icon={['fas', 'fa-circle-check']} className="pos-absolute r-0"/>;
    
    useEffect(()=>{
        getSelectedPlayers();
    },[]);

    const getSelectedPlayers = async () => {
        setIsLoading(true);
        await axios.get(SERVER_URL+'/get-selected-players/'+authTokens.user.id)
        .then(response => {
            if (response.data.players.length > 0) {
                setPlayers([...response.data.players.map(player => { return {...player, selected : false}})]);            
            }
            setIsLoading(false);
        })
        .catch(error => {
            console.log(error);
            setError(error);
            setIsLoading(false);
        });
    }

    function CreateTeamModal(props) {
        return (
          <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Enter Team Name
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={createTeam}>
                    <InputGroup className="mb-2">
                    {
                        isTeamCreating
                        ?
                       
                            <div className="text-center">
                                 <Spinner animation="border" role="status">
                                     <span className="visually-hidden">Loading...</span>
                                 </Spinner>
                             </div>
                        :
                            
                            <>
                                <FormControl
                                    placeholder="Team name"
                                    aria-label="Team name"
                                    aria-describedby="basic-addon2"
                                    ref={teamName}
                                    required    
                                />
                                <FormControl.Feedback type="invalid">
                                    Please provide team name.
                                </FormControl.Feedback>
                                <Button type="submit" variant="outline-secondary" id="button-addon2"/*  onClick={createTeam}  */disabled={isTeamCreating}>
                                    Save
                                </Button>
                            </>
                    }                        
                    </InputGroup>
                </Form>
            </Modal.Body>
          </Modal>
        );
    }
      
    const checkForPlayersPosition = (players, count, position) => {
        const playerCount = players.filter((player) => player.position == position).length;
        return playerCount < count ? true : false;
    }

    const handleCreateTeam = () => {
        if (selectedPlayers.length === 0) {
            setAlertHeading('Alert!');
            setAlertMessage('Please select player(s) first');
            setAlertShow(true);
            return;
        }

        if (selectedPlayers.length > 16) {
            setAlertHeading('Alert!');
            setAlertMessage('You can select maximum 16 player(s) only');
            setAlertShow(true);
            return;
        }

        if (checkForPlayersPosition(selectedPlayers, 4, 'Defender')) {
            setAlertHeading('Alert!');
            setAlertMessage('Please select atleast 4 Defender');
            setAlertShow(true);
            return;
        }

        if (checkForPlayersPosition(selectedPlayers, 4, 'Midfielder')) {
            setAlertHeading('Alert!');
            setAlertMessage('Please select atleast 4 Midfielder');
            setAlertShow(true);
            return;
        }

        if (checkForPlayersPosition(selectedPlayers, 2, 'Attacker')) {
            setAlertHeading('Alert!');
            setAlertMessage('Please select atleast 2 Attacker');
            setAlertShow(true);
            return;
        }

        if (checkForPlayersPosition(selectedPlayers, 2, 'Goalkeeper')) {
            setAlertHeading('Alert!');
            setAlertMessage('Please select atleast 2 Goalkeeper');
            setAlertShow(true);
            return;
        }

        setModalShow(true)
    }

    const createTeam = () => {
        setTeamCreating(true)
        let selectedPlayersIds = selectedPlayers.map(player => {return player.id}).join();
        let data = {
            userId:authTokens.user.id,
            userTeamPlayersIds: selectedPlayersIds,
            userTeamName: teamName.current.value
        }

        axios.post(SERVER_URL+'/create-team',data, {
          timeout: 20000 // timeout after 20 seconds
        })
        .then(response => {
            setModalShow(false);
            setTeamCreating(false);
            setAlertVariant('success');
            setAlertHeading('Success');
            setAlertMessage('Team created successfully.');
            setAlertShow(true);
        })
        .catch(error => {
            setModalShow(false);
            setTeamCreating(false);
            setAlertVariant('danger');
            setAlertHeading('Alert');
            setAlertMessage('Error: '+ error);
            setAlertShow(true);
        });
    }

    const togglePlayerSelectHandler = (p) => {
        const newList = [...players]; 
        const clickedPlayer = newList.find(x => x.id === p.id).selected;
        if(!clickedPlayer) {
        setSelectedPlayers([...selectedPlayers, p])
        } else {
        const newListSelectedPlayer = selectedPlayers.filter((player) => player.id !== p.id);
        setSelectedPlayers(newListSelectedPlayer);
        }

        newList.find(x => x.id === p.id).selected = !clickedPlayer;
        setPlayers(newList);
    }

    return (
        <Fragment>
           
            <CreateTeamModal
                show={modalShow}
                onHide={() =>{setModalShow(false)}}
                backdrop="static"
                keyboard={false}
                animation={false}
            />
        <div className="page-heading mg-b-10">
                <h1 className="mg-l-10">Selected Players</h1>            
                <Button variant="dark" className="btn-black" onClick={()=>handleCreateTeam()}>Create Team</Button>            
        </div>
        <AlertBox 
                show={alertShow} 
                variant={alertVariant} 
                heading={alertHeading} 
                message={alertMessage} 
                onHide={() => setAlertShow(false)}
            />
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
                                    players.length > 0
                                    ?
                                    players.map((player,index) => 
                                        <Col key={player.playerId}>
                                            <Card style={{ width: '18rem' }}  onClick={()=>togglePlayerSelectHandler(player)}>
                                                <Card.Body>
                                                    <Card.Title>{player.name}</Card.Title>
                                                    <Card.Subtitle className="mb-2 text-muted">{player.position}</Card.Subtitle>
                                                    <Row><Col xs={5}>Nationality</Col><Col xs={1}>:</Col><Col>{player.nationality}</Col></Row>
                                                    <Row><Col xs={5}>Team Name</Col><Col xs={1}>:</Col><Col>{player.teamName}</Col></Row>
                                                </Card.Body>
                                                {player.selected && checkIcon}
                                            </Card>
                                        </Col>
                                    )
                                    :
                                        <Col className="text-center">You have no players yet. Please add your player</Col>
                        }
                        
                    </Row>
                </Container>
            </div>
        </div>
        </Fragment>
    )
}

export default SelectedPlayers

