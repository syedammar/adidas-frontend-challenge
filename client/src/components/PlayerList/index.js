import React, {useState, useEffect, Fragment} from "react";
import axios from "axios";
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AlertBox from "../Alert";
import useAuthContext from "../../hooks/useAuthContext";
import { SERVER_URL } from "../../util/Constants";

const PlayerList = (props) => {
  const { authTokens  } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [error, setError] = useState(null);
  const checkIcon = <FontAwesomeIcon icon={['fas', 'fa-circle-check']} className="pos-absolute r-0"/>
  const [alertShow, setAlertShow] = useState(false);
  const [alertVariant, setAlertVariant] = useState('danger');
  const [alertHeading, setAlertHeading] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(()=>{
    setIsLoading(true);
    setAlertShow(false);
    setAlertVariant('danger');
    setSelectedPlayers([]);
    setPlayers([]);
    getTeamPlayersList();
  },[props.selectedTeamId]);
  
  const getTeamPlayersList = async () => {
    await axios.get(SERVER_URL+`/get-team-detail/${props.selectedTeamId}`,{
        timeout: 20000 // timeout after 20 seconds
    })
    .then(response => {
        console.log(response.data.data)
        let playersInTeam = response.data.data.squad;
        let teamName = response.data.data.name
        if (playersInTeam.length > 0) {
          setPlayers([...playersInTeam.map(player => { return {...player, selected : false, teamName: teamName}})]);            
        }
        setIsLoading(false);
    })
    .catch(error => {            
        setError(error);
        setIsLoading(false);
    })
  }

  const addPlayersToSelectedArea = () => {
      //let players = selectedPlayers.map(player => { return {, teamId: props.selectedTeamId, ...player})
      let data = {
          userId: authTokens.user.id,
          players: selectedPlayers,
          teamId: props.selectedTeamId
      }
      axios.post(SERVER_URL+'/save-players',data, {
        timeout: 20000 // timeout after 20 seconds
      })
      .then(response => {
          console.log(response.data.no_of_players);
          setAlertVariant('success');
          setAlertHeading('Success');
          setAlertMessage('players has been added successfully.');
          setAlertShow(true);
          setSelectedPlayers([]);
      })
      .catch(error => {
          console.log(error);
      });
  }

  const handleAddToAreaPlayer = () => {

    if (selectedPlayers.length === 0) {
      setAlertHeading('Alert!');
      setAlertMessage('Please select player(s) first');
      setAlertShow(true);
      return;
    }
    
    if (selectedPlayers.length > 4) {
      setAlertHeading('Alert!');
      setAlertMessage('You can select maximum 4 player(s) only');
      setAlertShow(true);
      return;
    }

    addPlayersToSelectedArea();
  }

  /* const togglePlayerSelectHandler = (index) => {
    //Rather than mutating the PLAYERS LIST, we keep it as immutable DS and therefore create a new list
    const newList = [...players];

    if (!newList[index].selected) {
      setSelectedPlayers([...selectedPlayers, newList[index]])
    } else {
      const newListSelectedPlayer = selectedPlayers.filter((player) => selectedPlayers[index].id !== player.id);
      setSelectedPlayers(newListSelectedPlayer);
    }

    newList[index].selected = !newList[index].selected;
    setPlayers(newList);
  } */

  /* More predictable way */
  const togglePlayerSelectHandler = (p) => {
    //Rather than mutating the PLAYERS LIST, we keep it as immutable DS and therefore create a new list
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

  console.log(selectedPlayers);
  return (
      <Fragment>
        <div className="wd-100pr d-inline-block">
            <div className="pos-absolute t-0 r-15">
                <Button variant="dark" className="btn-black"
                        onClick={handleAddToAreaPlayer}>Add to Selected Players Area</Button>
            </div>
        </div>
        <AlertBox 
                show={alertShow} 
                variant={alertVariant} 
                heading={alertHeading} 
                message={alertMessage} 
                onHide={() => setAlertShow(false)}
          />
        <div className="clearBoth mg-b-50">
            <div className="mg-r-15 mg-l-15 mg-t-10 mg-b-10" style={{minHeight:"800px"}}>
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
                                  <Col key={player.id}>
                                      <Card className="cr-pointer" style={{ width: '18rem' }} onClick={()=>togglePlayerSelectHandler(player)}>
                                          <Card.Body>
                                              <Card.Title>{player.name}</Card.Title>
                                              <Card.Subtitle className="mb-2 text-muted">{player.nationality}</Card.Subtitle>
                                              <Row><Col>Position</Col><Col xs={1}>:</Col><Col>{player.position}</Col></Row>
                                          </Card.Body>
                                        {player.selected && checkIcon}
                                      </Card>
                                  </Col>
                              )
                              :
                                <Col className="text-center">No players in this team</Col>
                        }
                        
                    </Row>
                </Container>
            </div>
        </div>
      </Fragment>
      )
}

export default PlayerList;