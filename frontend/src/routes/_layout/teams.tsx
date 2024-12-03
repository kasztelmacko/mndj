import {
  Container,
  Heading,
  SkeletonText,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Text,
  SimpleGrid,
  Center,
  Icon,
} from "@chakra-ui/react"
import { FiMail, FiUser } from "react-icons/fi"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"

import { TeamsService, UsersService, TeamPublic } from "../../client"
import Navbar from "../../components/Common/Navbar"
import AddTeam from "../../components/Teams/AddTeam"

const teamsSearchSchema = z.object({
  page: z.number().catch(1),
})

export const Route = createFileRoute("/_layout/teams")({
  component: Teams,
  validateSearch: (search) => teamsSearchSchema.parse(search),
})

function getTeamsQueryOptions() {
  return {
    queryFn: () => TeamsService.readTeams(),
    queryKey: ["teams"],
  }
}

function getUserQueryOptions({ owner_id }: { owner_id: string }) {
  return {
    queryFn: () => UsersService.readUserById({ user_id: owner_id }),
    queryKey: ["user", { owner_id }],
  }
}

function TeamsCards() {
  const {
    data: teams,
    isPending: isTeamsPending,
    isPlaceholderData: isTeamsPlaceholderData,
  } = useQuery({
    ...getTeamsQueryOptions(),
    placeholderData: (prevData) => prevData,
  })

  return (
    <>
      <SimpleGrid columns={{ base: 1, md: 3, lg: 4 }} spacing={4}>
        {isTeamsPending ? (
          new Array(5).fill(null).map((_, index) => (
            <Card key={index} opacity={isTeamsPlaceholderData ? 0.5 : 1}>
              <CardHeader>
                <SkeletonText noOfLines={1} />
              </CardHeader>
              <CardBody>
                <SkeletonText noOfLines={3} />
              </CardBody>
            </Card>
          ))
        ) : (
          teams?.data.map((team: TeamPublic) => (
            <TeamCard key={team.team_id} team={team} />
          ))
        )}
      </SimpleGrid>
    </>
  )
}

function TeamCard({ team }: { team: TeamPublic }) {
  const {
    data: user,
    isPending: isUserPending,
    isPlaceholderData: isUserPlaceholderData,
  } = useQuery({
    ...getUserQueryOptions({ owner_id: team.owner_id }),
    placeholderData: (prevData) => prevData,
  })

  return (
    <Card opacity={isUserPlaceholderData ? 0.5 : 1}>
      <CardHeader>
        <Center>
          <Heading size="4xl">{team.team_name}</Heading>
        </Center>
      </CardHeader>
      <CardBody>
        {isUserPending ? (
          <SkeletonText noOfLines={2} />
        ) : (
          <>
            <Text><br></br></Text>
            <Text>
              <Icon as={FiUser} mr={2} />
              owner: {user?.full_name}
            </Text>
            <Text>
              <Icon as={FiMail} mr={2} />
              contact: {user?.email}
            </Text>
          </>
        )}
      </CardBody>
      <CardFooter>
        <Center>
          {/* <SimpleGrid columns={2} spacing="4">
            <Button
              width="100%"
              variant="primary"
              py={2}
              my={1}
            >
              Items
            </Button>
            <Link
              to={`/teams/${team.team_id}/users`}
              style={{ width: '100%' }}
            >
              <Button
                width="100%"
                variant="primary"
                py={2}
                my={1}
              >
                Users
              </Button>
            </Link>
          </SimpleGrid> */}
        </Center>
      </CardFooter>
    </Card>
  )
}

function Teams() {
  return (
    <Container maxW="full">
      <Navbar type="team" addModalAs={AddTeam} />
      <TeamsCards />
    </Container>
  )
}