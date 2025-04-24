import {
  Box,
  // Button,
  // ButtonGroup,
  Text,
  Heading,
  // HStack,
  // Skeleton,
  // SkeletonCircle,
  // SkeletonText,
  Stack,
  // Steps,
  // StepsChangeDetails,
  Spinner,
} from "@chakra-ui/react";
import { toaster } from '@components/ui/toaster';
import api from '@utils/api';
import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { ScheduleRequestType, SchedulingInputOutputData, PlannedOrder } from "@customTypes/schedule";
import dayjs from "dayjs";
import minMax from 'dayjs/plugin/minMax';
import './schedule.css';
import FullCalendar from '@fullcalendar/react';
import { EventContentArg } from "@fullcalendar/core/index.js";
// import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

dayjs.extend(minMax);

const getEarliestDate = (orders: PlannedOrder[]) => {
  if (orders.length === 0) {
    return dayjs().format('YYYY-MM-DD');
  }
  const minDate = dayjs.min(orders.map(order => dayjs(order.job_begin)));
  if (minDate) {
    return minDate.format('YYYY-MM-DD');
  } else {
    return dayjs().format('YYYY-MM-DD');
  }
};

const renderEventContent = (eventInfo: EventContentArg) => {
  console.log(eventInfo)
  const { satelliteName, groundStationName, begin, end, priority } = eventInfo.event.extendedProps;
  const tooltipContent = (
    <div>
      {satelliteName} from {dayjs(begin).format('MMMM D, YYYY h:mm A')} to {dayjs(end).format('MMMM D, YYYY h:mm A')} downlinked at {groundStationName} priority {priority}
    </div>
  );

  return (
    <Tippy content={tooltipContent} placement="top">
      <div style={{ fontSize: 10 }}>{eventInfo.timeText}</div>
    </Tippy>
  );
};

const COLOR_PALETTE = [
  '#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0',
  '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8',
  '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080'
];

function stringToColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COLOR_PALETTE.length;
  return COLOR_PALETTE[index];
}

const Schedule = () => {
  const { id } = useParams();

  if (!id) {
    return (
      <Box>
        <Text>Loading...</Text>
      </Box>
    );
  }

  const [schedule, setSchedule] = useState<ScheduleRequestType | undefined>(undefined);
  const [scheduleOutput, setScheduleOutput] = useState<SchedulingInputOutputData | undefined>(undefined);

  const fetchSchedule = async () => {
    try {
      const res = await api.get<ScheduleRequestType>(`/schedule/${id}`);
      setSchedule(res.data);
    } catch (e) {
      toaster.create({ title: "Failed to fetch schedule", description: String(e), type: "error" });
      console.log(e);
    }
  };

  const fetchScheduleOutput = async () => {
    try {
      const res = await api.get<SchedulingInputOutputData>(`/schedule/output/${id}`);
      setScheduleOutput(res.data);
    } catch (e) {
      toaster.create({ title: "Failed to fetch schedule", description: String(e), type: "error" });
      console.log(e);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  useEffect(() => {
    if (schedule && schedule.status && schedule.status.toLowerCase() == "completed") {
      fetchScheduleOutput();
    }
  }, [schedule]);

  console.log(scheduleOutput)
  console.log(scheduleOutput ? getEarliestDate(Object.values(scheduleOutput.output.planned_orders).flat()) : '')

  return (
    <Stack>
      {schedule
        ? (
          <div>
            <Heading>{schedule.id}</Heading>
          </div>
        )
        : (<Spinner />)
      }
      {scheduleOutput
        ? (
          <FullCalendar
            plugins={[timeGridPlugin]}
            initialDate={getEarliestDate(Object.values(scheduleOutput.output.planned_orders).flat())}
            initialView="timeGridWeek"
            events={Object.entries(scheduleOutput.output.planned_orders)
              .flatMap(
                ([satelliteName, orders]) => orders.map(
                  order => ({
                    title: satelliteName,
                    start: order.job_begin,
                    end: order.job_end,
                    color: stringToColor(satelliteName),
                    extendedProps: {
                      satelliteName: order.satellite_name,
                      groundStationName: order.ground_station_name,
                      start: order.job_begin,
                      end: order.job_end,
                      priority: order.job.priority
                    }
                  })
                )
              )
            }
            eventContent={renderEventContent}
            editable={false}
          />
        )
        : (<Spinner />)}
    </Stack>
  );
};

export default Schedule;
