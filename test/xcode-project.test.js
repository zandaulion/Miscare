import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

// Exercise the project editor resolved by Capacitor, including the UUID-backed
// insertion and serialization paths affected by its scoped dependency override.
const require = createRequire(import.meta.url);
const capacitorRequire = createRequire(require.resolve('@capacitor/cli/package.json'));
const xcode = capacitorRequire('xcode');

test('Capacitor can parse, edit and round-trip a synthetic Xcode project', () => {
  const directory = mkdtempSync(path.join(tmpdir(), 'miscare-xcode-'));
  const file = path.join(directory, 'project.pbxproj');
  try {
    writeFileSync(file, `// !$*UTF8*$!
{
  archiveVersion = 1;
  classes = {};
  objectVersion = 56;
  objects = {
/* Begin PBXProject section */
    000000000000000000000001 /* Project object */ = {
      isa = PBXProject;
      mainGroup = 000000000000000000000002;
      targets = ();
    };
/* End PBXProject section */
/* Begin PBXGroup section */
    000000000000000000000002 = {
      isa = PBXGroup;
      children = ();
      sourceTree = "<group>";
    };
/* End PBXGroup section */
/* Begin XCBuildConfiguration section */
    000000000000000000000003 /* Debug */ = {
      isa = XCBuildConfiguration;
      buildSettings = { IPHONEOS_DEPLOYMENT_TARGET = 14.0; };
      name = Debug;
    };
/* End XCBuildConfiguration section */
  };
  rootObject = 000000000000000000000001 /* Project object */;
}
`);
    const project = xcode.project(file).parseSync();
    const group = project.addPbxGroup([], 'SyntheticGroup', 'SyntheticGroup');
    assert.match(group.uuid, /^[0-9A-F]{24}$/);
    project.updateBuildProperty('IPHONEOS_DEPLOYMENT_TARGET', '15.0');
    writeFileSync(file, project.writeSync());

    const roundTrip = xcode.project(file).parseSync();
    assert.equal(roundTrip.pbxGroupByName('SyntheticGroup').name, 'SyntheticGroup');
    assert.equal(roundTrip.pbxXCBuildConfigurationSection()['000000000000000000000003'].buildSettings.IPHONEOS_DEPLOYMENT_TARGET, '15.0');
    assert(roundTrip.allUuids().includes(group.uuid));
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
