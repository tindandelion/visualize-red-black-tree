import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import {
  aws_s3 as s3,
  aws_route53 as route53,
  aws_route53_targets as targets,
} from 'aws-cdk-lib'

const domain = 'tindandelion.art'
const websiteDomain = 'red-black.' + domain

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const bucket = new s3.Bucket(this, websiteDomain, {
      bucketName: websiteDomain,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      publicReadAccess: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
      websiteIndexDocument: 'index.html',
    })

    const zone = route53.HostedZone.fromLookup(this, 'hostedZone', {
      domainName: domain,
    })

    new route53.ARecord(this, 'websiteDomainRecord', {
      zone,
      recordName: websiteDomain,
      target: route53.RecordTarget.fromAlias(
        new targets.BucketWebsiteTarget(bucket)
      ),
    })
  }
}
