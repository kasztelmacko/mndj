import {
    Button,
    FormControl,
    FormLabel,
    Checkbox,
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
    type UpdateUserTeam,
    UserTeamsService,
    UserTeam,
  } from "../../client"
  import useCustomToast from "../../hooks/useCustomToast"
  import { handleError } from "../../utils"
  
  interface UpdateUserTeamProps {
    userteam: UserTeam
    isOpen: boolean
    onClose: () => void
    initialPermissions: UpdateUserTeam
  }
  
  const UpdateUserTeam = ({ userteam, isOpen, onClose, initialPermissions }: UpdateUserTeamProps) => {
    const queryClient = useQueryClient()
    const showToast = useCustomToast()
    const {
      register,
      handleSubmit,
      reset,
      formState: { isSubmitting, errors, isDirty },
    } = useForm<UpdateUserTeam>({
      mode: "onBlur",
      criteriaMode: "all",
      defaultValues: initialPermissions,
    })
  
    const mutation = useMutation({
      mutationFn: (data: UpdateUserTeam) =>
        UserTeamsService.updateUserTeam({ team_id: userteam.team_id, user_id: userteam.user_id, requestBody: data }),
      onSuccess: () => {
        showToast("Success!", "User permissions updated successfully.", "success")
        onClose()
      },
      onError: (err: ApiError) => {
        handleError(err, showToast)
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["teams"] })
      },
    })
  
    const onSubmit: SubmitHandler<UpdateUserTeam> = async (data) => {
      mutation.mutate(data)
    }
  
    const onCancel = () => {
      reset()
      onClose()
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
          <ModalHeader>Update User Permissions</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl mt={4} isInvalid={!!errors.can_edit_labs}>
              <FormLabel htmlFor="can_edit_labs">Can Edit Labs</FormLabel>
              <Checkbox
                id="can_edit_labs"
                {...register("can_edit_labs")}
              />
            </FormControl>
  
            <FormControl mt={4} isInvalid={!!errors.can_edit_items}>
              <FormLabel htmlFor="can_edit_items">Can Edit Items</FormLabel>
              <Checkbox
                id="can_edit_items"
                {...register("can_edit_items")}
              />
            </FormControl>
  
            <FormControl mt={4} isInvalid={!!errors.can_edit_users}>
              <FormLabel htmlFor="can_edit_users">Can Edit Users</FormLabel>
              <Checkbox
                id="can_edit_users"
                {...register("can_edit_users")}
              />
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
    )
  }
  
  export default UpdateUserTeam