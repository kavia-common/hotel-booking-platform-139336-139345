#!/bin/bash
cd /home/kavia/workspace/code-generation/hotel-booking-platform-139336-139345/hotel_booking_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

