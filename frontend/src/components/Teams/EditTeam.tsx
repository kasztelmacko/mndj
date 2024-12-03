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
  
  import {
    type ApiError,
    type TeamPublic,
    type TeamUpdate,
    TeamsService,
  } from "../../client"
  import useCustomToast from "../../hooks/useCustomToast"
  import { handleError } from "../../utils"
  
  interface EditTeamProps {
    team: TeamPublic
    isOpen: boolean
    onClose: () => void
  }
  
  const EditTeam = ({ team, isOpen, onClose }: EditTeamProps) => {
    const queryClient = useQueryClient()
    const showToast = useCustomToast()
    const {
      register,
      handleSubmit,
      reset,
      formState: { isSubmitting, errors, isDirty },
    } = useForm<TeamUpdate>({
      mode: "onBlur",
      criteriaMode: "all",
      defaultValues: team,
    })
  
    const mutation = useMutation({
      mutationFn: (data: TeamPublic) =>
        TeamsService.updateTeam({ team_id: team.team_id, requestBody: data }),
      onSuccess: () => {
        showToast("Success!", "Team updated successfully.", "success")
        onClose()
      },
      onError: (err: ApiError) => {
        handleError(err, showToast)
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["teams"] })
      },
    })
  
    const onSubmit: SubmitHandler<TeamUpdate> = async (data) => {
      mutation.mutate(data)
    }
  
    const onCancel = () => {
      reset()
      onClose()
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
            <ModalHeader>Edit Team</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl isRequired isInvalid={!!errors.team_name}>
                <FormLabel htmlFor="title">Name</FormLabel>
                <Input
                  id="team_name"
                  {...register("team_name", {
                    required: "Name is required.",
                  })}
                  placeholder="Name"
                  type="text"
                />
                {errors.team_name && (
                  <FormErrorMessage>{errors.team_name.message}</FormErrorMessage>
                )}
              </FormControl>
            </ModalBody>
            <ModalFooter gap={3}>
              <Button
                variant="primary"
                type="submit"
                isLoading={isSubmitting}
                isDisabled={!isDirty}
              >
                Save
              </Button>
              <Button onClick={onCancel}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }
  
  export default EditTeam;
  