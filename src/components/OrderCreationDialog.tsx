import {
  Button,
  CloseButton,
  Dialog,
  Field,
  Flex,
  Input,
  Portal,
  SegmentGroup,
  Separator,
  Stack,
} from "@chakra-ui/react";
import { toaster } from '@components/ui/toaster';
import api from '@utils/api';
import { Controller, useForm } from "react-hook-form";
import { OrderRequestType } from "@customTypes/order";

type OrderCreationDialogProps = {
  missionId: string;
  fetchOrders: () => Promise<void>
};

const OrderCreationDialog: React.FC<OrderCreationDialogProps> = ({ missionId, fetchOrders }) => {

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderRequestType>({
    defaultValues: { priority: 1, image_type: "low" },
  });

  const createOrder = async (data: OrderRequestType) => {
    try {
      await api.post("/imaging/order", data);
      await fetchOrders();
      toaster.create({ title: "Order created", type: "success" });
    } catch (e) {
      toaster.create({ title: "Order creation failed", description: String(e), type: "error" });
      console.log(e);
    }
  };

  return (
    <Dialog.Root size="lg">
      <Dialog.Trigger asChild>
        <Button variant="surface" colorPalette="teal" width="100%">
          Create New Order
        </Button>
      </Dialog.Trigger>
      <Separator size="lg" />
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Create Order</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <form onSubmit={handleSubmit(createOrder)}>
                <Stack gap="4" align="flex-start">
                  <input type="hidden" value={missionId} {...register("mission_id")} />
                  <input type="hidden" value={1} {...register("priority")} />
                  <Field.Root>
                    <Field.Label>Name</Field.Label>
                    <Input {...register("image_name")} />
                    <Field.ErrorText>{errors.image_name?.message}</Field.ErrorText>
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Latitude</Field.Label>
                    <Input {...register("latitude")} type="number" />
                    <Field.ErrorText>{errors.latitude?.message}</Field.ErrorText>
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Longitude</Field.Label>
                    <Input {...register("longitude")} type="number" />
                    <Field.ErrorText>{errors.longitude?.message}</Field.ErrorText>
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Start</Field.Label>
                    <Input {...register("image_start_time")} type="datetime-local" />
                    <Field.ErrorText>{errors.image_start_time?.message}</Field.ErrorText>
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>End</Field.Label>
                    <Input {...register("image_end_time")} type="datetime-local" />
                    <Field.ErrorText>{errors.image_end_time?.message}</Field.ErrorText>
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Delivery</Field.Label>
                    <Input {...register("delivery_time")} type="datetime-local" />
                    <Field.ErrorText>{errors.delivery_time?.message}</Field.ErrorText>
                  </Field.Root>
                  <Flex justifyContent="space-evenly" width="100%">
                    <Controller
                      control={control}
                      name="priority"
                      render={({ field }) => (
                        <Field.Root invalid={!!errors.priority}>
                          <Field.Label>Priority</Field.Label>
                          <SegmentGroup.Root
                            onBlur={field.onBlur}
                            name={field.name}
                            value={`${field.value}`}
                            onValueChange={({ value }) => field.onChange(value)}
                          >
                            <SegmentGroup.Indicator />
                            {[
                              { label: "Low", value: 1 },
                              { label: "Medium", value: 2 },
                              { label: "High", value: 3 },
                            ].map((item, index) => (
                              <SegmentGroup.Item key={index} value={`${item.value}`}>
                                <SegmentGroup.ItemText>{item.label}</SegmentGroup.ItemText>
                                <SegmentGroup.ItemHiddenInput />
                              </SegmentGroup.Item>
                            ))}
                          </SegmentGroup.Root>
                          <Field.ErrorText>{errors.priority?.message}</Field.ErrorText>
                        </Field.Root>
                      )}
                    />
                    <Controller
                      control={control}
                      name="image_type"
                      render={({ field }) => (
                        <Field.Root invalid={!!errors.image_type}>
                          <Field.Label>Image Type</Field.Label>
                          <SegmentGroup.Root
                            onBlur={field.onBlur}
                            name={field.name}
                            value={`${field.value}`}
                            onValueChange={({ value }) => field.onChange(value)}
                          >
                            <SegmentGroup.Indicator />
                            {[
                              { label: "Low Res.", value: "low" },
                              { label: "Medium Res.", value: "medium" },
                              { label: "Spotlight", value: "high" },
                            ].map((item, index) => (
                              <SegmentGroup.Item key={index} value={`${item.value}`}>
                                <SegmentGroup.ItemText>{item.label}</SegmentGroup.ItemText>
                                <SegmentGroup.ItemHiddenInput />
                              </SegmentGroup.Item>
                            ))}
                          </SegmentGroup.Root>
                          <Field.ErrorText>{errors.image_type?.message}</Field.ErrorText>
                        </Field.Root>
                      )}
                    />
                  </Flex>
                  <Button type="submit">Create</Button>
                </Stack>
              </form>
            </Dialog.Body>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default OrderCreationDialog;
