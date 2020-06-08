#!/bin/sh
ibmcloud login -a https://cloud.ibm.com -r eu-gb
ibmcloud target -g Default
ibmcloud target -r eu-de
ibmcloud fn property set --namespace 61a8ba7e-a114-4441-b4e1-2365f8da273e
