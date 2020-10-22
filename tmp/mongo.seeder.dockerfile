FROM mongo

COPY ./mongo-data-dump /mongo_data
# Profiles collection
CMD mongorestore --host mongodb --db juanportal /mongo_data
#CMD mongorestore --host mongodb --db juanportal /mongo_data
