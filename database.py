import psycopg2

from configparser import ConfigParser
import datetime


def config(filename='database.ini', section='postgresql'):
    # create a parser
    parser = ConfigParser()
    # read config file
    parser.read(filename)

    # get section, default to postgresql
    db = {}
    if parser.has_section(section):
        params = parser.items(section)
        for param in params:
            db[param[0]] = param[1]
    else:
        raise Exception('Section {0} not found in the {1} file'.format(section, filename))

    return db


def query_tiempo_espera_horas(date_from='0001-01-01', date_to=None):
    if date_to is None:
        now = datetime.datetime.now()
        date_to = now.strftime("%Y-%m-%d")
    """ Connect to the PostgreSQL database server """
    conn = None
    try:
        # read connection parameters
        params = config()

        # connect to the PostgreSQL server
        print('Connecting to the PostgreSQL database...')
        conn = psycopg2.connect(**params)

        # create a cursor
        cur = conn.cursor()

        # execute a statement
        cur.execute('SELECT dim_ips.municipio, dim_ips.nombre, AVG(tiempo_espera_horas)::numeric::integer as horas_de_espera'
                    +' FROM citas_medicas, dim_ips, dim_fecha'
                    +' WHERE dim_ips.key_ips = citas_medicas. key_ips AND dim_fecha.key_date = citas_medicas.key_fecha_atencion'
                    +" AND dim_fecha.date >= '"+date_from +"' AND dim_fecha.date <= '" +date_to + "' "
                    +' GROUP BY dim_ips.nombre, dim_ips.municipio'
                    +' ORDER BY avg(tiempo_espera_horas) DESC'
                    )

        print("The number of rows: ", cur.rowcount)
        # display the rows
        rows = cur.fetchall()
        # print(rows[:10])
        return rows

        # close the communication with the PostgreSQL
        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()
            print('Database connection closed.')


def query_numero_pacientes():
    """ Connect to the PostgreSQL database server """
    conn = None
    try:
        # read connection parameters
        params = config()

        # connect to the PostgreSQL server
        print('Connecting to the PostgreSQL database...')
        conn = psycopg2.connect(**params)

        # create a cursor
        cur = conn.cursor()

        # execute a statement
        cur.execute('SELECT dim_ips.departamento, dim_ips.municipio, dim_ips.nombre,  COUNT(*) as numero_pacientes'
                    +' FROM citas_medicas, dim_ips'
                    +' WHERE dim_ips.key_ips = citas_medicas. key_ips'
                    +' GROUP BY dim_ips.nombre, dim_ips.municipio, dim_ips.departamento'
                    +' ORDER BY COUNT(*) DESC'
                    )

        print("The number of rows: ", cur.rowcount)
        # display the rows
        rows = cur.fetchall()
        # print(rows[:10])
        return rows

        # close the communication with the PostgreSQL
        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()
            print('Database connection closed.')


if __name__ == '__main__':
    query_tiempo_espera_horas()
