import {useEffect, useState} from "react";
import {MostVisitedURL} from "./most-visited-url.model";
import {Button, Card, Col, Container, Row} from "react-bootstrap";
import './users-top-sites.scss';


export default function UsersTopSites(): JSX.Element {
    const [mostVisitedSites, setMostVisitedSites] = useState<MostVisitedURL[]>([]);
    useEffect(() => {
        chrome.topSites && chrome.topSites.get((data: MostVisitedURL[]) => {
            setMostVisitedSites(data);
        });
    }, []);

    return (
        <Container>
            <Row>
                {mostVisitedSites.map((mostVisitedSite) => (
                    <Col>
                        <Card className="card-c">
                            <Card.Body>
                                <Card.Title>{mostVisitedSite.title}</Card.Title>
                                <Card.Text>{mostVisitedSite.url}</Card.Text>
                            </Card.Body>
                            <Card.Footer>
                                <Button variant="primary" href={mostVisitedSite.url}>Go There!</Button>
                            </Card.Footer>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}
