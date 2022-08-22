# DataMD

A web-based collaboration platform for project managers and medical professionals to annotate medical images for use in AI and ML model training.

## Authors

- [@0einstein0](https://www.github.com/qenfay)
- [@qenfay](https://www.github.com/0einstein0)

## Run Locally

To run this project, follow the following steps.

First install dependencies.

```bash
  pip install -r requirements.txt
```

Then add database credentials in `settings.py`. This project uses `MySQL` on Google Cloud Platform. Please look at GCP documentation for guide on connecting a database. Alternatively you can use a local database server or `SQLite`

Run Django server using 

```bash
  python manage.py runserver
```
