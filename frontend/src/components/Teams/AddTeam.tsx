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
  } from "@chakra-ui/react"
  import { useMutation, useQueryClient } from "@tanstack/react-query"
  import { type SubmitHandler, useForm } from "react-hook-form"
  
  import { type ApiError, type TeamCreate, TeamsService } from "../../client"
  import useCustomToast from "../../hooks/useCustomToast"
  import { handleError } from "../../utils"
  
  interface AddTeamProps {
    isOpen: boolean
    onClose: () => void
  }
  
  const AddTeam = ({ isOpen, onClose }: AddTeamProps) => {
    const queryClient = useQueryClient()
    const showToast = useCustomToast()
    const {
      register,
      handleSubmit,
      reset,
      formState: { errors, isSubmitting },
    } = useForm<TeamCreate>({
      mode: "onBlur",
      criteriaMode: "all",
      defaultValues: {
        team_name: ""
      },
    })
  
    const mutation = useMutation({
      mutationFn: (data: TeamCreate) =>
        TeamsService.createTeam({ requestBody: data }),
      onSuccess: () => {
        showToast("Success!", "Team created successfully.", "success")
        reset()
        onClose()
      },
      onError: (err: ApiError) => {
        handleError(err, showToast)
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["teams"] })
      },
    })
  
    const onSubmit: SubmitHandler<TeamCreate> = (data) => {
      mutation.mutate(data)
    }
  
    return (
      <>
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          size={{ base: "sm", md: "md" }}
          isCentered
        >
          <ModalOverlay />
          <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>Add Team</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl isRequired isInvalid={!!errors.team_name}>
                <FormLabel htmlFor="title">Place</FormLabel>
                <Input
                  id="team_name"
                  {...register("team_name", {
                    required: "Name is required.",
                  })}
                  placeholder="ex. IMiF"
                  type="text"
                />
                {errors.team_name && (
                  <FormErrorMessage>{errors.team_name.message}</FormErrorMessage>
                )}
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
      </>
    )
  }
  
  export default AddTeam;