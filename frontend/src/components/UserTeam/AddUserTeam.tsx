import {
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Checkbox,
  } from "@chakra-ui/react"
  import { useMutation, useQueryClient } from "@tanstack/react-query"
  import { type SubmitHandler, useForm } from "react-hook-form"
  
  import { type ApiError, type UserTeamCreate, UserTeamsService } from "../../client"
  import useCustomToast from "../../hooks/useCustomToast"
  import { handleError } from "../../utils"
  
  interface AddUserTeamProps {
    isOpen: boolean
    onClose: () => void
    teamId: string
  }
  
  const AddUserTeam = ({ isOpen, onClose, teamId }: AddUserTeamProps) => {
    const queryClient = useQueryClient()
    const showToast = useCustomToast()
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<UserTeamCreate>({
        mode: "onBlur",
        criteriaMode: "all",
        defaultValues: {
            email: "",
            can_edit_items: false,
            can_edit_labs: false,
            can_edit_users: false,
        },
    })
  
    const mutation = useMutation({
      mutationFn: (data: UserTeamCreate) => {
          return UserTeamsService.createUserTeam({ team_id: teamId, requestBody: data });
      },
      onSuccess: () => {
          showToast("Success!", "User added to Team successfully.", "success");
          reset();
          onClose();
      },
      onError: (err: ApiError) => {
          handleError(err, showToast);
      },
      onSettled: () => {
          queryClient.invalidateQueries({ queryKey: ["teams"] });
      },
  });
  
    const onSubmit: SubmitHandler<UserTeamCreate> = (data) => {
        mutation.mutate(data)
    }
  
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size={{ base: "sm", md: "md" }}
            isCentered
        >
            <ModalOverlay />
            <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
                <ModalHeader>Add User to Team</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <FormControl isRequired isInvalid={!!errors.email}>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <Input
                            id="email"
                            {...register("email", {
                                required: "Email is required.",
                            })}
                            placeholder="Enter email"
                            type="email"
                        />
                        {errors.email && (
                            <FormErrorMessage>{errors.email.message}</FormErrorMessage>
                        )}
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel htmlFor="can_edit_team">Can Edit Team</FormLabel>
                        <Checkbox
                            id="can_edit_team"
                            {...register("can_edit_labs")}
                        />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel htmlFor="can_edit_items">Can Edit Items</FormLabel>
                        <Checkbox
                            id="can_edit_items"
                            {...register("can_edit_items")}
                        />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel htmlFor="can_edit_users">Can Edit Users</FormLabel>
                        <Checkbox
                            id="can_edit_users"
                            {...register("can_edit_users")}
                        />
                    </FormControl>
                </ModalBody>
  
                <ModalFooter gap={3}>
                    <Button variant="primary" type="submit" isLoading={isSubmitting}>
                        Save
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
  }
  
  export default AddUserTeam