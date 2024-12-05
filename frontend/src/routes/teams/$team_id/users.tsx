import {
    Container,
    SkeletonText,
    Card,
    CardHeader,
    CardBody,
    Text,
    SimpleGrid,
    Icon,
    Center,
    Heading,
  } from "@chakra-ui/react";
  import { FiMail } from "react-icons/fi";
  import { useQuery } from "@tanstack/react-query";
  import { createFileRoute } from "@tanstack/react-router";
  import { z } from "zod";
  
  import { UserTeamsService, UserPublic, UserWithPermissions } from "../../../client";
  import Navbar from "../../../components/Common/Navbar";
  import AddUserTeam from "../../../components/UserTeam/AddUserTeam";
  import ActionsMenu from "../../../components/Common/ActionsMenu";
  import useAuth from "../../../hooks/useAuth";
  
  const UsersTeamSearchSchema = z.object({
    page: z.number().catch(1),
  });
  
  export const Route = createFileRoute("/$team_id/users")({
    component: UserTeams,
    validateSearch: (search) => UsersTeamSearchSchema.parse(search),
  });
  
  function getUserTeamsQueryOptions(team_id: string) {
    return {
      queryFn: () => {
        console.log("y", team_id);
        return UserTeamsService.viewTeamUsers({ team_id });
      },
      queryKey: ["teams", team_id],
    };
  }
  
  function getCurrentUserPermissions(user_id: string, team_id: string) {
    return {
      queryFn: () => {
        console.log("x", user_id, "and team_id:", team_id);
        return UserTeamsService.viewTeamUser({ team_id, user_id });
      },
      queryKey: ["teams", team_id, "users", user_id],
    };
  }
  
  interface UserTeamsCardsProps {
    currentUser: UserPublic;
  }
  
  function UserTeamsCards({ currentUser }: UserTeamsCardsProps) {
    const { team_id } = Route.useParams();
    const {
      data: users,
      isPending: isUserTeamsPending,
      isPlaceholderData: isUserTeamsPlaceholderData,
    } = useQuery({
      ...getUserTeamsQueryOptions(team_id),
      placeholderData: (prevData) => prevData,
    });
  
    return (
      <SimpleGrid columns={{ base: 1, md: 3, lg: 5 }} spacing={4}>
        {isUserTeamsPending ? (
          new Array(5).fill(null).map((_, index) => (
            <Card key={index} opacity={isUserTeamsPlaceholderData ? 0.5 : 1}>
              <CardHeader>
                <SkeletonText noOfLines={1} />
              </CardHeader>
              <CardBody>
                <SkeletonText noOfLines={3} />
              </CardBody>
            </Card>
          ))
        ) : (
          Array.isArray(users) &&
          users.map((user: UserWithPermissions) => (
            <UserLabCard key={user.user_id} user={user} currentUser={currentUser} />
          ))
        )}
      </SimpleGrid>
    );
  }
  
  interface UserTeamCardProps {
    user: UserWithPermissions;
    currentUser: UserPublic;
  }
  
  function UserLabCard({ user, currentUser }: UserTeamCardProps) {
    const { team_id } = Route.useParams();
    const { 
      data: currentUserPermissions, 
      isLoading: isLoadingPermissions, 
      error: permissionsError 
    } = useQuery(
      getCurrentUserPermissions(currentUser.user_id, team_id)
    );
  
    if (isLoadingPermissions) {
      return (
        <Card>
          <CardHeader>
            <SkeletonText noOfLines={1} />
          </CardHeader>
          <CardBody>
            <SkeletonText noOfLines={3} />
          </CardBody>
        </Card>
      );
    }
  
    if (permissionsError || !currentUserPermissions) {
      return (
        <Card>
          <CardHeader>
            <Center>
              <Text>
                <Heading size="2xl">{user.full_name}</Heading>
              </Text>
            </Center>
          </CardHeader>
          <CardBody>
            <Center>
              <Text>
                <Icon as={FiMail} mr={2} />
                contact: {user.email}
              </Text>
            </Center>
          </CardBody>
        </Card>
      );
    }
  
    const canEdit = currentUserPermissions.can_edit_users;
  
    return (
      <Card>
        <CardHeader>
          <Center>
            <Text>
              <Heading size="2xl">{user.full_name}</Heading>
            </Text>
          </Center>
        </CardHeader>
        <CardBody>
          <Center>
            <Text>
              <Icon as={FiMail} mr={2} />
              contact: {user.email}
            </Text>
          </Center>
          {canEdit && <ActionsMenu type={"UserLab"} value={user} />}
        </CardBody>
      </Card>
    );
  }
  
  function UserTeams() {
    const { user: currentUser } = useAuth();
    if (!currentUser) {
      return null;
    }
    const { team_id } = Route.useParams();
    return (
      <Container maxW="full">
        <Navbar type={"users"} addModalAs={AddUserTeam} team_id={team_id} />
        <UserTeamsCards currentUser={currentUser} />
      </Container>
    );
  }
  
  export default UserTeams;