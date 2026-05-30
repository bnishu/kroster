import { execSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

// We will scan binlog.000006 and binlog.000007
const binlogFiles = [
  '/opt/homebrew/var/mysql/binlog.000006',
  '/opt/homebrew/var/mysql/binlog.000007'
];

interface MemberData {
  slug: string;
  email: string | null;
  teamRole: string | null;
  profileImage: string | null;
  fullName: string | null;
  lastUpdated: number;
}

const membersMap = new Map<string, MemberData>();

function extractStringValue(valueString: string): string | null {
  if (valueString.includes('NULL')) return null;
  const match = valueString.match(/'([^']*)'/);
  if (match) return match[1];
  return valueString.trim();
}

for (const file of binlogFiles) {
  if (!fs.existsSync(file)) continue;

  console.log(`Parsing ${file}...`);
  try {
    const cmd = `mysqlbinlog --base64-output=DECODE-ROWS -v ${file}`;
    const output = execSync(cmd, { encoding: 'utf-8', maxBuffer: 1024 * 1024 * 100 });
    
    const lines = output.split('\n');
    let inMemberUpdate = false;
    let isUpdate = false;
    let isInsert = false;
    
    let currentData: Partial<MemberData> = {};
    let captureSet = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.startsWith('### UPDATE `kroster`.`members`')) {
        inMemberUpdate = true;
        isUpdate = true;
        isInsert = false;
        currentData = {};
        captureSet = false;
      } else if (line.startsWith('### INSERT INTO `kroster`.`members`')) {
        inMemberUpdate = true;
        isInsert = true;
        isUpdate = false;
        currentData = {};
        captureSet = true;
      } else if (inMemberUpdate && line.startsWith('### SET')) {
        captureSet = true;
      } else if (inMemberUpdate && line.startsWith('### ')) {
        // still in some other part (like WHERE)
      } else if (inMemberUpdate && !line.startsWith('###')) {
        // End of the statement block usually means next SQL statement or binlog event
        if (currentData.slug) {
          const existing = membersMap.get(currentData.slug);
          // Only update if this is not a mock email
          if (currentData.email && currentData.email.includes('mock.com')) {
             // Mock email from erroneous seed, ignore
          } else {
            membersMap.set(currentData.slug, {
              slug: currentData.slug,
              email: currentData.email !== undefined ? currentData.email : (existing?.email || null),
              teamRole: currentData.teamRole !== undefined ? currentData.teamRole : (existing?.teamRole || null),
              profileImage: currentData.profileImage !== undefined ? currentData.profileImage : (existing?.profileImage || null),
              fullName: currentData.fullName !== undefined ? currentData.fullName : (existing?.fullName || null),
              lastUpdated: Date.now()
            });
          }
        }
        inMemberUpdate = false;
        isUpdate = false;
        isInsert = false;
      }
      
      if (inMemberUpdate && captureSet) {
        if (line.startsWith('###   @2=')) {
          currentData.fullName = extractStringValue(line.split('=')[1]);
        } else if (line.startsWith('###   @3=')) {
          currentData.slug = extractStringValue(line.split('=')[1]);
        } else if (line.startsWith('###   @8=')) {
          currentData.email = extractStringValue(line.split('=')[1]);
        } else if (line.startsWith('###   @14=')) {
          currentData.profileImage = extractStringValue(line.split('=')[1]);
        } else if (line.startsWith('###   @30=')) {
          currentData.teamRole = extractStringValue(line.split('=')[1]);
        }
      }
    }
    
    // Also save the last parsed block if the file ended
    if (inMemberUpdate && currentData.slug) {
      if (!(currentData.email && currentData.email.includes('mock.com'))) {
        const existing = membersMap.get(currentData.slug);
        membersMap.set(currentData.slug, {
          slug: currentData.slug,
          email: currentData.email !== undefined ? currentData.email : (existing?.email || null),
          teamRole: currentData.teamRole !== undefined ? currentData.teamRole : (existing?.teamRole || null),
          profileImage: currentData.profileImage !== undefined ? currentData.profileImage : (existing?.profileImage || null),
          fullName: currentData.fullName !== undefined ? currentData.fullName : (existing?.fullName || null),
          lastUpdated: Date.now()
        });
      }
    }
  } catch (error) {
    console.error(`Error processing ${file}:`, error);
  }
}

// Filter to only those with valid custom emails or roles
const validMembers = Array.from(membersMap.values()).filter(m => 
  (m.email && !m.email.includes('mock.com')) || 
  m.teamRole
);

const outputPath = path.join(__dirname, 'recovered_members.json');
fs.writeFileSync(outputPath, JSON.stringify(validMembers, null, 2));

console.log(`Recovered data for ${validMembers.length} members.`);
console.log(`Saved to ${outputPath}`);
