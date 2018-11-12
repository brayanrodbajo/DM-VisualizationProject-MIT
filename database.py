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
                    +" AND dim_fecha.date >= '"+date_from +"' AND dim_fecha.date <= '" + date_to + "' "
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


def query_numero_pacientes(date_from='0001-01-01', date_to=None):
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
        cur.execute('SELECT dim_ips.departamento, dim_ips.municipio, dim_ips.nombre,  COUNT(*) as numero_pacientes'
                    + ' FROM citas_medicas, dim_ips, dim_fecha'
                    + ' WHERE dim_ips.key_ips = citas_medicas. key_ips AND dim_fecha.key_date = citas_medicas.key_fecha_atencion'
                    + " AND dim_fecha.date >= '" + date_from + "' AND dim_fecha.date <= '" + date_to + "' "
                    + ' GROUP BY dim_ips.nombre, dim_ips.municipio, dim_ips.departamento'
                    + ' ORDER BY COUNT(*) DESC'
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


def query_utilizacion_pacientes(servicio, date_from='0001-01-01', date_to=None): #servicio=hospitalizaciones or servicio=urgencias
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
        cur.execute(
            """SELECT 
            sub.tipo_usuario,
            CASE
              WHEN sub.fecha_nacimiento  > '01-jan-1993'  THEN '1-25' 
              WHEN sub.fecha_nacimiento > '01-jan-1968' THEN '25-50'
              WHEN sub.fecha_nacimiento > '01-jan-1943' THEN '50-75' 
              ELSE '75+' 
            END AS Age_Range, 
            COUNT(*),
            SUM(CASE WHEN sub.sexo = 'M' THEN 1 ELSE 0 END) AS Males,
            SUM(CASE WHEN sub.sexo = 'F' THEN 1 ELSE 0 END) AS Females
            FROM dim_fecha, 
            (
                SELECT """+servicio+""".key_fecha_atencion, dim_persona.tipo_usuario, dim_persona.key_persona, dim_persona.sexo, dim_persona.fecha_nacimiento, count(*)
                FROM dim_persona INNER JOIN """+servicio+""" ON dim_persona.key_persona = """+servicio+""".key_persona
                GROUP BY """+servicio+""".key_fecha_atencion, dim_persona.tipo_usuario, dim_persona.key_persona, dim_persona.sexo, dim_persona.fecha_nacimiento
            ) as sub
            WHERE sub.key_fecha_atencion = dim_fecha.key_date
            AND dim_fecha.date >= '""" + date_from + """' AND dim_fecha.date <= '""" + date_to + """' 
            GROUP BY sub.tipo_usuario, Age_Range;"""
                    )

        print("The number of rows: ", cur.rowcount)
        # display the rows
        rows = cur.fetchall()
        # print(rows[:5])
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
