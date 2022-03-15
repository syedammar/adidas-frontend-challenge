import React, {useState, useEffect} from "react";
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab'
import CompetitionList from "../../components/CompetitionList";
import TeamList from "../../components/TeamList";
import PlayerList from "../../components/PlayerList";
const AddPlayers = () => {
    const [key, setKey] = useState('competition-list');
    const [teamListTab, setTeamListTab] = useState(true);
    const [playerListTab, setPlayerListTab] = useState(true);
    const [selectedCompetitionId, setSelectedCompetitionId] = useState(null);
    const [selectedTeamId, setSelectedTeamId] = useState(null);
   
    useEffect(()=>{
        if (key === 'competition-list') {
            setTeamListTab(true);
            setPlayerListTab(true);
        }
    }, [key]);

    const competitionClickHandler = (id) => {
        setSelectedCompetitionId(id);
        setTeamListTab(false);
        setKey('team-list');
    }

    const teamClickHndler = (id) => {
        setSelectedTeamId(id);
        setPlayerListTab(false);
        setKey('player-list');
    }

    const playerClickHandler = (player) => {

    }

    return (
        <Tabs
            id="add-players"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-3"
        >
            <Tab eventKey="competition-list" title="Competions">
                <CompetitionList onCompetitonClick={competitionClickHandler}/>
            </Tab>
            <Tab eventKey="team-list" title="Teams" disabled={teamListTab}>
                {
                    selectedCompetitionId
                    ?
                    <TeamList competitionId={selectedCompetitionId} onTeamClick={teamClickHndler}/>
                        : null
                }
                                  
            </Tab>
            <Tab eventKey="player-list" title="Players" disabled={playerListTab}>
                {
                    selectedTeamId
                    ?
                    <PlayerList selectedTeamId={selectedTeamId} onPlayerClick={playerClickHandler}/>
                        : null
                }
                
            </Tab>
        </Tabs>
    )


}

export default AddPlayers;